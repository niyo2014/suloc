import prisma from '../db.js';

// Submit contact form (Public)
export const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, service_type, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email and message are required' });
        }

        const submission = await prisma.contact_submissions.create({
            data: {
                name,
                email,
                phone: phone || '',
                service_type,
                message,
                status: 'new'
            }
        });

        res.status(201).json({ message: 'Message sent successfully', id: submission.id });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// Get all submissions (Admin)
export const adminGetSubmissions = async (req, res) => {
    try {
        const submissions = await prisma.contact_submissions.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
};

// Update submission status (Admin)
export const adminUpdateSubmissionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const submission = await prisma.contact_submissions.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.json(submission);
    } catch (error) {
        console.error('Error updating submission status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
};

// Delete submission (Admin)
export const adminDeleteSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.contact_submissions.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Submission deleted successfully' });
    } catch (error) {
        console.error('Error deleting submission:', error);
        res.status(500).json({ error: 'Failed to delete submission' });
    }
};
