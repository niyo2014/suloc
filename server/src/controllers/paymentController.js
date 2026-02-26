import prisma from '../db.js';

/**
 * Generate a unique SULOC verification code
 * Format: SU-XXX-XXX where X is alphanumeric excluding confusing characters
 */
async function generateSULOCode() {
    const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // Excludes 0, 1, I, L, O
    let unique = false;
    let code = '';

    while (!unique) {
        let p1 = '';
        let p2 = '';
        for (let i = 0; i < 3; i++) {
            p1 += chars.charAt(Math.floor(Math.random() * chars.length));
            p2 += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        code = `SU-${p1}-${p2}`;

        const existing = await prisma.payment_requests.findUnique({
            where: { verification_code: code }
        });

        if (!existing) unique = true;
    }
    return code;
}

// Get active operators and rates
export const getOperators = async (req, res) => {
    try {
        const operators = await prisma.payment_services.findMany({
            where: { is_active: true },
            orderBy: { order_index: 'asc' }
        });
        res.json(operators);
    } catch (error) {
        console.error('Error fetching operators:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new remittance request
export const createRequest = async (req, res) => {
    try {
        const {
            client_name, client_phone, client_whatsapp,
            amount, payment_service_id, total_to_pay, amount_to_receive,
            transaction_type, currency, payment_method,
            sender_name, sender_address, receiver_name, receiver_id_number,
            receiver_phone, receiver_address
        } = req.body;

        const verification_code = await generateSULOCode();

        // Handle File Paths (if any)
        let receiverPhotoPath = null;
        let bankSlipPath = null;

        if (req.files) {
            if (req.files.receiver_photo && req.files.receiver_photo[0]) {
                receiverPhotoPath = `/uploads/payments/${req.files.receiver_photo[0].filename}`;
            }
            if (req.files.bank_slip && req.files.bank_slip[0]) {
                bankSlipPath = `/uploads/payments/${req.files.bank_slip[0].filename}`;
            }
        }

        // Logic for Payout Status (Legacy Parity)
        const vStatus = (payment_method === 'cash') ? 'verified' : 'pending';
        const pStatus = (payment_method === 'cash') ? 'Ready' : 'Pending';
        const finalCode = (payment_method === 'cash') ? verification_code : null;

        const request = await prisma.payment_requests.create({
            data: {
                client_name: client_name || sender_name,
                client_phone: client_phone || receiver_phone,
                client_whatsapp,
                sender_name,
                sender_address,
                receiver_name,
                receiver_id_number,
                receiver_phone,
                receiver_address,
                receiver_photo: receiverPhotoPath,
                bank_slip_proof: bankSlipPath,
                amount: parseFloat(amount),
                payment_service_id: parseInt(payment_service_id),
                total_to_pay: parseFloat(total_to_pay),
                amount_to_receive: parseFloat(amount_to_receive),
                verification_code: finalCode,
                transaction_type: transaction_type || 'send',
                status: 'new',
                payment_verification_status: vStatus,
                payout_status: pStatus,
                currency: currency || 'USD',
                payment_method
            }
        });

        res.status(201).json({
            message: 'Demande de transfert créée avec succès',
            verification_code: finalCode,
            request_id: request.id
        });
    } catch (error) {
        console.error('Error creating payment request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Track request by code
export const trackRequest = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Code de vérification requis' });
    }

    try {
        const request = await prisma.payment_requests.findUnique({
            where: { verification_code: code },
            select: {
                payout_status: true,
                payment_verification_status: true,
                amount_to_receive: true,
                currency: true,
                created_at: true
            }
        });

        if (!request) {
            return res.json({ found: false });
        }

        // Map status to labels (100% parity with legacy payment-helpers.php)
        let statusInfo = { label: 'Inconnu', color: '#6b7280' };

        if (request.payment_verification_status === 'pending') {
            statusInfo = { label: 'En attente de vérification bancaire', color: '#6366f1' };
        } else {
            switch (request.payout_status) {
                case 'Pending':
                    statusInfo = { label: 'En cours de traitement', color: '#fbbf24' };
                    break;
                case 'Ready':
                    statusInfo = { label: 'Prêt pour retrait', color: '#10b981' };
                    break;
                case 'Paid':
                    statusInfo = { label: 'Déjà Payé', color: '#3b82f6' };
                    break;
                case 'Cancelled':
                    statusInfo = { label: 'Annulé', color: '#ef4444' };
                    break;
            }
        }

        res.json({
            found: true,
            label: statusInfo.label,
            color: statusInfo.color,
            amount: request.amount_to_receive,
            currency: request.currency,
            date: new Date(request.created_at).toLocaleDateString('fr-FR')
        });
    } catch (error) {
        console.error('Error tracking payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Admin: Get all requests
export const adminGetRequests = async (req, res) => {
    try {
        const requests = await prisma.payment_requests.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                admin_users: {
                    select: { username: true }
                }
            }
        });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching admin payments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Admin: Update status
export const adminUpdateStatus = async (req, res) => {
    const { id } = req.params;
    let { status, payout_status, payment_verification_status, admin_notes, verification_code } = req.body;

    try {
        // Legacy Parity: If status becomes Ready and code is missing, generate it
        if (payout_status === 'Ready' && !verification_code) {
            const currentReq = await prisma.payment_requests.findUnique({
                where: { id: parseInt(id) },
                select: { verification_code: true }
            });
            if (currentReq && !currentReq.verification_code) {
                verification_code = await generateSULOCode();
            }
        }

        const request = await prisma.payment_requests.update({
            where: { id: parseInt(id) },
            data: {
                status,
                payout_status,
                payment_verification_status,
                admin_notes,
                verification_code,
                updated_at: new Date()
            }
        });
        res.json(request);
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Operator Management
export const adminCreateOperator = async (req, res) => {
    try {
        const operator = await prisma.payment_services.create({
            data: {
                ...req.body,
                is_active: req.body.is_active ?? true
            }
        });
        res.status(201).json(operator);
    } catch (error) {
        console.error('Error creating operator:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const adminUpdateOperator = async (req, res) => {
    const { id } = req.params;
    try {
        const operator = await prisma.payment_services.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(operator);
    } catch (error) {
        console.error('Error updating operator:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const adminDeleteOperator = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.payment_services.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Opérateur supprimé' });
    } catch (error) {
        console.error('Error deleting operator:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Settings Management
export const getPaymentSettings = async (req, res) => {
    try {
        const settings = await prisma.site_settings.findMany({
            where: {
                setting_key: {
                    in: ['daily_rate_bif', 'daily_rate_cdf', 'transfer_fee_percentage']
                }
            }
        });

        // Convert array to object for easier use
        const settingsMap = settings.reduce((acc, s) => {
            acc[s.setting_key] = s.setting_value;
            return acc;
        }, {});

        res.json(settingsMap);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updatePaymentSettings = async (req, res) => {
    const updates = req.body; // { key: value, ... }
    try {
        for (const [key, value] of Object.entries(updates)) {
            await prisma.site_settings.upsert({
                where: { setting_key: key },
                update: { setting_value: String(value) },
                create: { setting_key: key, setting_value: String(value) }
            });
        }
        res.json({ message: 'Paramètres mis à jour' });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
