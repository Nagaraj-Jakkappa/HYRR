export interface ResumeData {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        website?: string;
        linkedin?: string;
    };
    summary: string;
    experience: {
        _id?: string;
        company: string;
        position: string;
        startDate: string;
        endDate: string;
        current: boolean;
        description: string; // Markdown or plain newline text blocks
    }[];
    education: {
        institution: string;
        degree: string;
        fieldOfStudy: string;
        startDate: string;
        endDate: string;
    }[];
    skills: string[];
}