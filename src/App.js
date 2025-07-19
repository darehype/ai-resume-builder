import React, { useState, useCallback } from 'react';

// --- Helper Components ---

const IconCopy = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);

const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const LoadingSpinner = ({ text = 'Loading...' }) => (
    <div className="flex flex-col justify-center items-center p-8 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-gray-600">{text}</p>
    </div>
);

const MessageBox = ({ message, type = 'info' }) => {
    const baseClasses = "p-4 rounded-md text-sm";
    const typeClasses = {
        info: "bg-blue-100 text-blue-800",
        error: "bg-red-100 text-red-800",
        success: "bg-green-100 text-green-800",
    };
    return <div className={`${baseClasses} ${typeClasses[type]}`}>{message}</div>;
};

// --- Main Application Components ---

const Header = () => (
    <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">AI-Powered CV & Cover Letter Personalizer</h1>
            <p className="mt-2 text-md text-gray-600">Your one-stop shop for tailoring job applications. Analyze your fit, personalize documents, and prepare for interviews.</p>
        </div>
    </header>
);

const InputSection = ({ onGenerate, onAnalyze, isLoading }) => {
    const [jobDescription, setJobDescription] = useState('');

    const handleAction = (action) => {
        if (!jobDescription.trim()) {
            const modal = document.getElementById('alert-modal');
            if(modal) modal.style.display = 'flex';
            return;
        }
        action(jobDescription);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Paste Job Description</h2>
            <textarea
                className="w-full h-60 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                placeholder="Paste the job description URL or text here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isLoading}
            />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button
                    onClick={() => handleAction(onAnalyze)}
                    disabled={isLoading}
                    className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-300 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center"
                >
                    ✨ Analyze Fit
                </button>
                <button
                    onClick={() => handleAction(onGenerate)}
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center"
                >
                    Generate Documents
                </button>
            </div>
        </div>
    );
};

const OutputDocument = ({ title, content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const textArea = document.createElement('textarea');
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md relative h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                <button
                    onClick={handleCopy}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-3 rounded-md text-sm flex items-center space-x-2 transition"
                >
                    {copied ? <IconCheck /> : <IconCopy />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
            </div>
            <div className="prose prose-sm max-w-none h-[calc(100%-4rem)] overflow-y-auto p-4 border rounded-md bg-gray-50">
                <pre className="whitespace-pre-wrap font-sans text-sm">{content}</pre>
            </div>
        </div>
    );
};

const AnalysisOutput = ({ analysis }) => {
    if (!analysis) return null;
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">✨ Fit Analysis</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-green-700">Strengths</h3>
                    <ul className="list-disc list-inside text-gray-700 mt-1">
                        {analysis.strengths.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-orange-700">Potential Gaps</h3>
                     <ul className="list-disc list-inside text-gray-700 mt-1">
                        {analysis.gaps.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-indigo-700">Summary</h3>
                    <p className="text-gray-700 mt-1">{analysis.summary}</p>
                </div>
            </div>
        </div>
    );
};

const InterviewQuestionsOutput = ({ questions, onGenerate, isLoading }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-semibold text-gray-800">✨ Interview Preparation</h2>
                 <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition"
                 >
                     {isLoading ? 'Generating...' : 'Regenerate Questions'}
                 </button>
            </div>
            {isLoading && <LoadingSpinner text="Generating questions..." />}
            {!isLoading && questions && (
                 <ul className="list-decimal list-inside space-y-2 text-gray-700">
                    {questions.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
            )}
        </div>
    );
}

const AlertModal = () => (
    <div id="alert-modal" className="fixed inset-0 bg-black bg-opacity-50 z-50 hidden items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-sm text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Input Required</h3>
            <p className="text-gray-600 mb-6">Please paste a job description before generating documents or analyzing fit.</p>
            <button
                onClick={() => { document.getElementById('alert-modal').style.display = 'none'; }}
                className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-md hover:bg-indigo-700"
            >
                OK
            </button>
        </div>
    </div>
);


// --- Main App Component ---

export default function App() {
    // --- State Management ---
    const [jobDescription, setJobDescription] = useState('');
    const [personalizedCV, setPersonalizedCV] = useState('');
    const [personalizedCoverLetter, setPersonalizedCoverLetter] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [interviewQuestions, setInterviewQuestions] = useState([]);

    const [loadingState, setLoadingState] = useState({
        isAnalyzing: false,
        isGeneratingDocs: false,
        isGeneratingQuestions: false,
    });
    const [error, setError] = useState(null);

    const isLoading = Object.values(loadingState).some(Boolean);

    // --- Original Data from User's PDF ---
    const originalCV = `
LEONARD TIBURCIO
Bookkeeper | Al-Enhanced Financial Operations
+65 921 260 6148 | daryltiburcio@gmail.com | Marikina, Philippines

PROFESSIONAL SUMMARY:
Detail-oriented and results-driven Certified Bookkeeper with 4+ years of experience managing full-cycle accounting functions and driving cost-saving initiatives. Specializes in integrating Al-powered automation into financial workflows to increase efficiency, accuracy, and strategic insight. Proven ability to maintain compliance, support audits, and optimize financial operations in remote and on-site environments.

WORK EXPERIENCE:
Bookkeeper | Valtechnologies, Inc *US-Based (Oct 2020 - May 2025) - Remote
• Migrated financial systems to QuickBooks, saving $60K annually through automation and system consolidation.
• Handled AP/AR, payroll, and monthly close processes with 100% compliance and on-time execution.
• Integrated Al tools and no-code automation (LLMs+n8n) to optimize invoice categorization, reminders, and recurring entries.
• Reduced reconciliation and tax prep time by 15% through streamlined digital workflows.
• Conducted team training sessions on QuickBooks features, reducing manual entry errors by 40%.

Accounting Specialist | South Sea Development Corporation (Aug 2018 - Sept 2020) - On-site
• Processed 200+ monthly invoices, achieving 100% accuracy in accounts payable/receivable.
• Prepared monthly financial statements (P&L, balance sheets) and collaborated with auditors for year-end reviews.
• Organized tax databases and ensured compliance with Philippine BIR regulations.

EDUCATION:
Bachelor of Science in Accountancy
Philippine School of Business Administration - Quezon City (2013 - 2017)

SKILLS:
Technical:
• Accounting: GAAP/IFRS Standards, Tax Compliance, Payroll, Budgeting & Forecasting
• Core Bookkeeping: AR/AP, Bank Reconciliations, Financial Reporting, Auditing
• Al & Automation: LLMs (Large Language Models), n8n Workflow Automation
Software:
• QuickBooks Online/Desktop | MS Excel (VLOOKUP, PivotTables) | Canva | LLMs | n8n
Soft Skills:
• Confidentiality | Analytical Thinking | Process Optimization | Accuracy & Precision | Self-Driven

CERTIFICATIONS:
• QuickBooks Online ProAdvisor Certification | Intuit (Sept 2023)
• Bookkeeping with QuickBooks Online | ABPG (June 2022)
• Google Digital Garage Certification | Al Digital Marketing & Productivity Tools (2023)
    `;

    // --- Generic Gemini API Caller ---
    const callGemini = async (prompt, responseSchema) => {
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: responseSchema
            }
        };
        const apiKey = ""; // Handled by environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const result = await response.json();
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            return JSON.parse(result.candidates[0].content.parts[0].text);
        } else {
            throw new Error("Invalid response structure from API.");
        }
    };

    // --- Feature Handlers ---
    const handleAnalyzeFit = useCallback(async (desc) => {
        setLoadingState(s => ({ ...s, isAnalyzing: true }));
        setError(null);
        setJobDescription(desc);

        const prompt = `You are an expert career coach. Analyze the provided CV against the job description. Provide a concise analysis of how well the candidate's experience aligns with the role. Identify top requirements, list strengths and gaps, and summarize the fit. Return a JSON object with keys: "strengths" (array of strings), "gaps" (array of strings), and "summary" (a string).

        CV: --- ${originalCV} ---
        Job Description: --- ${desc} ---`;

        const schema = {
            type: "OBJECT",
            properties: {
                strengths: { type: "ARRAY", items: { type: "STRING" } },
                gaps: { type: "ARRAY", items: { type: "STRING" } },
                summary: { type: "STRING" }
            },
            required: ["strengths", "gaps", "summary"]
        };

        try {
            const result = await callGemini(prompt, schema);
            setAnalysis(result);
        } catch (e) {
            console.error(e);
            setError(`Fit Analysis Failed: ${e.message}`);
        } finally {
            setLoadingState(s => ({ ...s, isAnalyzing: false }));
        }
    }, [originalCV]);

    const handleGenerateDocs = useCallback(async (desc) => {
        setLoadingState(s => ({ ...s, isGeneratingDocs: true }));
        setError(null);
        setJobDescription(desc);
        setPersonalizedCV('');
        setPersonalizedCoverLetter('');

        const prompt = `
        You are an expert resume and cover letter writer. Generate a personalized CV and a personalized cover letter based on the provided documents and the job description.

        **CV Generation Instructions:**
        1.  **Tailor the Professional Summary:** Rewrite the summary to mirror the language and key requirements of the job description.
        2.  **Highlight Relevant Experience:** Rephrase bullet points in the work experience to emphasize accomplishments that match the job. Quantify results where possible.
        3.  **Preserve Formatting:** It is CRITICAL to preserve the original formatting of the CV (line breaks, spacing, indentation).

        **Cover Letter Generation Instructions (CRITICAL):**
        1.  **Word Count:** The final letter must be between 180 and 200 words. This is a strict requirement.
        2.  **Analyze and Target:** First, identify the top 2-3 most critical skills/requirements from the job description.
        3.  **Structure and Formatting:** The final output MUST be a single string that looks like a professionally formatted letter. It must include:
            * A proper salutation (e.g., "Dear Hiring Manager,").
            * An opening paragraph stating the role being applied for.
            * A body paragraph (or two) that directly proves how you meet the top requirements identified in step 2. Use a specific achievement from your CV as evidence for each point.
            * A closing paragraph with a confident call to action.
            * A proper closing (e.g., "Sincerely,\\nLeonard Tiburcio").
            * Ensure there are double line breaks between paragraphs for readability.

        **Output Format:**
        Return a single JSON object with two keys: "cv" and "coverLetter".

        **Candidate's Original CV:**
        ---
        ${originalCV}
        ---

        **Job Description:**
        ---
        ${desc}
        ---
        `;

        const schema = {
            type: "OBJECT",
            properties: {
                cv: { "type": "STRING" },
                coverLetter: { "type": "STRING" }
            },
            required: ["cv", "coverLetter"]
        };

        try {
            const result = await callGemini(prompt, schema);
            setPersonalizedCV(result.cv);
            setPersonalizedCoverLetter(result.coverLetter);
            setInterviewQuestions([]);
        } catch (e) {
            console.error(e);
            setError(`Document Generation Failed: ${e.message}`);
        } finally {
            setLoadingState(s => ({ ...s, isGeneratingDocs: false }));
        }
    }, [originalCV]);

    const handleGenerateQuestions = useCallback(async () => {
        if (!personalizedCV || !jobDescription) return;
        setLoadingState(s => ({ ...s, isGeneratingQuestions: true }));
        setError(null);

        const prompt = `You are a hiring manager. Based on the candidate's tailored CV and the job description, generate 10 insightful interview questions (a mix of behavioral, technical, and situational). Return a JSON object with one key: "questions" (an array of strings).

        Tailored CV: --- ${personalizedCV} ---
        Job Description: --- ${jobDescription} ---`;

        const schema = {
            type: "OBJECT",
            properties: {
                questions: { type: "ARRAY", items: { type: "STRING" } }
            },
            required: ["questions"]
        };

        try {
            const result = await callGemini(prompt, schema);
            setInterviewQuestions(result.questions);
        } catch (e) {
            console.error(e);
            setError(`Question Generation Failed: ${e.message}`);
        } finally {
            setLoadingState(s => ({ ...s, isGeneratingQuestions: false }));
        }
    }, [personalizedCV, jobDescription]);

    // --- Render Logic ---
    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <AlertModal />
            <Header />
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        <InputSection onGenerate={handleGenerateDocs} onAnalyze={handleAnalyzeFit} isLoading={isLoading} />

                        {error && <MessageBox message={error} type="error" />}

                        {loadingState.isAnalyzing && <LoadingSpinner text="Analyzing fit..." />}
                        {analysis && !loadingState.isAnalyzing && <AnalysisOutput analysis={analysis} />}

                        {loadingState.isGeneratingDocs && <LoadingSpinner text="Generating documents..." />}
                        {personalizedCV && !loadingState.isGeneratingDocs && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <OutputDocument title="Personalized CV" content={personalizedCV} />
                                <OutputDocument title="Personalized Cover Letter" content={personalizedCoverLetter} />
                            </div>
                        )}

                        {personalizedCV && !loadingState.isGeneratingDocs && (
                             <InterviewQuestionsOutput 
                                questions={interviewQuestions} 
                                onGenerate={handleGenerateQuestions} 
                                isLoading={loadingState.isGeneratingQuestions}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
