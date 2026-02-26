import prisma from '../db.js';

// Get public visa services (Active only)
export const getPublicVisaServices = async (req, res) => {
    try {
        const visas = await prisma.visa_services.findMany({
            where: { is_active: true },
            orderBy: [
                { order_index: 'asc' },
                { country_name_fr: 'asc' }
            ]
        });
        res.json(visas);
    } catch (error) {
        console.error('Error fetching public visas:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Admin: Get all visa services
export const getAllVisaServices = async (req, res) => {
    try {
        const { search } = req.query;

        const where = {};
        if (search) {
            where.OR = [
                { country_name_fr: { contains: search } },
                { country_name_en: { contains: search } }
            ];
        }

        const visas = await prisma.visa_services.findMany({
            where,
            orderBy: [
                { order_index: 'asc' },
                { country_name_fr: 'asc' }
            ]
        });
        res.json(visas);
    } catch (error) {
        console.error('Error fetching admin visas:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Admin: Create visa service
export const createVisaService = async (req, res) => {
    try {
        const data = req.body;

        // Convert fee to decimal if present
        if (data.service_fee) {
            data.service_fee = parseFloat(data.service_fee);
        }

        const visa = await prisma.visa_services.create({
            data: {
                country_code: data.country_code || '',
                country_name_fr: data.country_name_fr,
                country_name_en: data.country_name_en,
                requirements_fr: data.requirements_fr,
                requirements_en: data.requirements_en,
                documents_needed_fr: data.documents_needed_fr,
                documents_needed_en: data.documents_needed_en,
                service_fee: data.service_fee,
                currency: data.currency || 'USD',
                processing_time: data.processing_time,
                is_active: data.is_active ?? true,
                order_index: data.order_index ? parseInt(data.order_index) : 0
            }
        });

        res.status(201).json(visa);
    } catch (error) {
        console.error('Error creating visa service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Admin: Update visa service
export const updateVisaService = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.service_fee) {
            data.service_fee = parseFloat(data.service_fee);
        }

        const visa = await prisma.visa_services.update({
            where: { id: parseInt(id) },
            data: {
                country_code: data.country_code,
                country_name_fr: data.country_name_fr,
                country_name_en: data.country_name_en,
                requirements_fr: data.requirements_fr,
                requirements_en: data.requirements_en,
                documents_needed_fr: data.documents_needed_fr,
                documents_needed_en: data.documents_needed_en,
                service_fee: data.service_fee,
                currency: data.currency,
                processing_time: data.processing_time,
                is_active: data.is_active,
                order_index: data.order_index ? parseInt(data.order_index) : undefined
            }
        });

        res.json(visa);
    } catch (error) {
        console.error('Error updating visa service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Admin: Delete visa service
export const deleteVisaService = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.visa_services.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Visa service deleted successfully' });
    } catch (error) {
        console.error('Error deleting visa service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Public: Submit visa assistance request
export const submitVisaAssistanceRequest = async (req, res) => {
    try {
        const {
            full_name,
            email,
            phone,
            whatsapp,
            origin_country,
            destination_country,
            visa_type,
            travel_purpose,
            departure_date,
            duration_stay
        } = req.body;

        // Validation
        if (!full_name || !email || !phone || !origin_country || !destination_country || !visa_type) {
            return res.status(400).json({ success: false, message: 'Veuillez remplir tous les champs obligatoires (*)' });
        }

        // Create the request
        const request = await prisma.visa_assistance_requests.create({
            data: {
                full_name,
                email,
                phone,
                whatsapp,
                origin_country,
                destination_country,
                visa_type,
                travel_purpose,
                departure_date: departure_date ? new Date(departure_date) : null,
                duration_stay,
                status: 'received',
                visa_assistance_logs: {
                    create: {
                        action_type: 'submission',
                        action_description: 'Nouvelle demande soumise via le site web'
                    }
                }
            }
        });

        // Handle uploaded files if any
        if (req.files && req.files.length > 0) {
            const docsData = req.files.map(file => ({
                request_id: request.id,
                file_name: file.originalname,
                file_path: file.filename,
                file_type: file.mimetype,
                file_size: file.size
            }));

            await prisma.visa_assistance_docs.createMany({
                data: docsData
            });
        }

        res.status(201).json({
            success: true,
            message: 'Votre demande a été envoyée avec succès. SULOC vous contactera prochainement.',
            requestId: request.id
        });

    } catch (error) {
        console.error('Error submitting visa request:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'enregistrement de votre demande.' });
    }
};

// Admin: Get all visa assistance requests
export const getVisaAssistanceRequests = async (req, res) => {
    try {
        const { status } = req.query;
        const where = status && status !== 'all' ? { status } : {};

        const requests = await prisma.visa_assistance_requests.findMany({
            where,
            orderBy: { created_at: 'desc' }
        });

        res.json(requests);
    } catch (error) {
        console.error('Error fetching visa assistance requests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Admin: Get visa assistance request detail
export const getVisaAssistanceRequestDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await prisma.visa_assistance_requests.findUnique({
            where: { id: parseInt(id) },
            include: {
                visa_assistance_docs: true,
                visa_assistance_logs: {
                    include: {
                        admin_users: {
                            select: { full_name: true, username: true }
                        }
                    },
                    orderBy: { created_at: 'desc' }
                }
            }
        });

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.json(request);
    } catch (error) {
        console.error('Error fetching visa assistance request detail:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Admin: Update visa assistance request
export const updateVisaAssistanceRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, admin_notes, checklist_status, assigned_agent_id } = req.body;
        const admin_id = req.user.id;

        // Get current status for logging
        const currentRequest = await prisma.visa_assistance_requests.findUnique({
            where: { id: parseInt(id) }
        });

        const updatedRequest = await prisma.visa_assistance_requests.update({
            where: { id: parseInt(id) },
            data: {
                status,
                admin_notes,
                checklist_status: JSON.stringify(checklist_status),
                assigned_agent_id: assigned_agent_id ? parseInt(assigned_agent_id) : null,
                visa_assistance_logs: {
                    create: {
                        admin_id,
                        action_type: 'status_update',
                        action_description: `Statut/Détails mis à jour. Nouveau statut: ${status}${status !== currentRequest.status ? ' (changé depuis ' + currentRequest.status + ')' : ''}`
                    }
                }
            }
        });

        res.json(updatedRequest);
    } catch (error) {
        console.error('Error updating visa assistance request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Admin: Get visa assistance settings (templates)
export const getVisaAssistanceSettings = async (req, res) => {
    try {
        const settings = await prisma.visa_assistance_settings.findMany();
        const templates = {};
        settings.forEach(s => {
            templates[s.setting_key] = s.setting_value;
        });
        res.json(templates);
    } catch (error) {
        console.error('Error fetching visa assistance settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
