import prisma from '../db.js';

// Submit a new logistics RFQ (Public)
export const createImportRequest = async (req, res) => {
    try {
        const {
            client_name,
            client_email,
            client_phone,
            client_whatsapp,
            origin_country,
            destination_country,
            transit_port,
            cargo_type,
            container_size,
            incoterm,
            commodity_type,
            cargo_description,
            estimated_weight
        } = req.body;

        console.log('Received RFQ Data:', req.body);

        // Basic validation
        if (!client_name || !client_phone || !origin_country || !destination_country) {
            return res.status(400).json({ error: 'Missing mandatory fields' });
        }

        // Map Enum values to Prisma schema requirements
        const mappedContainerSize = {
            '20ft': 'ft_20',
            '40ft': 'ft_40',
            'LCL/Groupage': 'LCL_Groupage'
        }[container_size] || container_size;

        const mappedTransitPort = {
            'Dar es Salaam': 'Dar_es_Salaam',
            'Mombasa': 'Mombasa'
        }[transit_port] || transit_port;

        const newRequest = await prisma.import_requests.create({
            data: {
                client_name,
                client_email,
                client_phone,
                client_whatsapp,
                origin_country,
                destination_country,
                transit_port: mappedTransitPort,
                cargo_type,
                container_size: mappedContainerSize,
                incoterm,
                commodity_type,
                cargo_description,
                estimated_weight: estimated_weight ? parseFloat(estimated_weight) : null,
                status: 'new'
            }
        });

        // Format WhatsApp message
        const wa_msg = `SULOC RFQ #${newRequest.id}
Client: ${client_name}
Route: ${origin_country} -> ${destination_country} (Port: ${transit_port || 'N/A'})
Cargo: ${commodity_type || 'N/A'} (${cargo_type || 'N/A'} / ${container_size || 'N/A'})
Incoterm: ${incoterm || 'N/A'}
Weight: ${estimated_weight || 'N/A'} kg`;

        res.status(201).json({
            success: true,
            message: 'Request submitted successfully',
            request_id: newRequest.id,
            wa_message: wa_msg
        });
    } catch (error) {
        console.error('Error creating import request:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message,
            code: error.code // Useful for Prisma-specific errors
        });
    }
};

// Get all import requests (Admin)
export const getAllImportRequests = async (req, res) => {
    try {
        const requests = await prisma.import_requests.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching import requests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update request status (Admin)
export const updateImportRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, admin_notes } = req.body;

        const updatedRequest = await prisma.import_requests.update({
            where: { id: parseInt(id) },
            data: {
                status,
                admin_notes,
                updated_at: new Date()
            }
        });

        res.json(updatedRequest);
    } catch (error) {
        console.error('Error updating import request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete request (Admin)
export const deleteImportRequest = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.import_requests.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Request deleted successfully' });
    } catch (error) {
        console.error('Error deleting import request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
