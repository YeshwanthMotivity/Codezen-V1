// import React, { useState } from 'react';
// import axios from 'axios';
// import { Github, FileText, Bot, Download, Loader2, File, AlertTriangle } from 'lucide-react';

// // --- API Configuration and Functions ---
// const API_BASE = "http://127.0.0.1:8000";

// /**
//  * 1️⃣ Fetch GitHub repo files
//  */
// const fetchRepo = async (repoUrl) => {
//   const response = await axios.get(`${API_BASE}/fetch-repo`, {
//     params: { repo_url: repoUrl },
//   });
//   return response.data;
// };

// /**
//  * 2️⃣ Generate documentation
//  */
// const generateDocs = async (files) => {
//   const response = await axios.post(`${API_BASE}/generate-docs`, { files });
//   return response.data;
// };

// /**
//  * 3️⃣ Export documentation (PDF/DOCX/etc.)
//  */
// const exportDocs = async (format = "pdf", files = []) => {
//   const response = await axios.post(
//     `${API_BASE}/export-docs?format=${format}`,
//     { files },
//     { responseType: "blob" }
//   );
//   return response;
// };
// // -----------------------------------------------------------


// // Helper to replace window.alert
// const Notification = ({ message, type, onClose }) => {
//     if (!message) return null;

//     const baseClasses = "fixed top-4 right-4 p-4 rounded-xl shadow-2xl flex items-center z-50 transition-transform transform duration-300";
//     let styleClasses = "";
//     let Icon = AlertTriangle;

//     switch (type) {
//         case 'success':
//             styleClasses = "bg-green-500 text-white";
//             break;
//         case 'error':
//             styleClasses = "bg-red-500 text-white";
//             break;
//         case 'info':
//         default:
//             styleClasses = "bg-blue-500 text-white";
//     }

//     return (
//         <div className={`${baseClasses} ${styleClasses} animate-fade-in-down`}>
//             <Icon className="w-5 h-5 mr-2" />
//             <span>{message}</span>
//             <button onClick={onClose} className="ml-4 font-bold">×</button>
//         </div>
//     );
// };


// const FORMAT_OPTIONS = [
//     { key: "pdf", label: "PDF Document" },
//     { key: "docx", label: "Word Document" },
//     { key: "md", label: "Markdown File" },
//     { key: "html", label: "HTML Webpage" },
//     { key: "txt", label: "Plain Text" },
// ];

// // Custom style for the neon text glow effect
// const neonGlowStyle = {
//     textShadow: '0 0 4px #f87171, 0 0 10px #ef4444', 
// };

// // Custom Tailwind Font Classes (In a real app, these would be configured in tailwind.config.js)
// // We will use inline styles/global style tags to load the fonts.

// const FontLoader = () => (
//     <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Space+Grotesk:wght@300..700&display=swap');
//         .font-orbitron { font-family: 'Orbitron', sans-serif; }
//         .font-space-grotesk { font-family: 'Space Grotesk', sans-serif; }
//     `}</style>
// );


// function App() {
//   const [repoUrl, setRepoUrl] = useState("https://github.com/my-user/my-repo");
//   const [repoData, setRepoData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [format, setFormat] = useState("pdf"); // Default export format
//   const [pdfUrl, setPdfUrl] = useState(null); // URL for PDF viewing
//   const [notification, setNotification] = useState({ message: null, type: 'info' });

//   const showNotification = (message, type = 'info', duration = 3000) => {
//       setNotification({ message, type });
//       setTimeout(() => setNotification({ message: null, type: 'info' }), duration);
//   };

//   const handleFetch = async () => {
//     if (!repoUrl) {
//         showNotification("Please enter a GitHub repository URL.", 'error');
//         return;
//     }
//     setLoading(true);
//     setPdfUrl(null); // Clear previous view
//     try {
//         const data = await fetchRepo(repoUrl);
//         if (data.error) {
//             showNotification(`Error: ${data.error}`, 'error', 5000);
//             setRepoData(null);
//         } else {
//             setRepoData(data);
//             showNotification(`Repo '${data.repo_name}' fetched successfully!`, 'success');
//         }
//     } catch (e) {
//         showNotification("Failed to fetch repository. Check URL and API connectivity.", 'error', 5000);
//         setRepoData(null);
//     } finally {
//         setLoading(false);
//     }
//   };

//   const handleGenerate = async () => {
//     if (!repoData || !repoData.files || repoData.files.length === 0) {
//         showNotification("Please fetch a repository with files first.", 'error');
//         return;
//     }
//     setLoading(true);
//     setPdfUrl(null); // Clear view
//     try {
//         // Note: The /generate-docs endpoint currently just returns the generated documentation structure, 
//         // but the /export-docs endpoint performs the generation AND export.
//         // For this frontend, we'll confirm generation succeeded.
//         await generateDocs(repoData.files);
//         showNotification("Documentation content generated by the agent!", 'success');
//     } catch (e) {
//         showNotification("Documentation generation failed. Check backend logs.", 'error', 5000);
//     } finally {
//         setLoading(false);
//     }
//   };

//   const handleExport = async () => {
//     if (!repoData || !repoData.files) {
//         showNotification("Please fetch a repository first!", 'error');
//         return;
//     }

//     setLoading(true);
//     setPdfUrl(null); // Clear previous PDF view
//     try {
//         const response = await exportDocs(format, repoData.files);
        
//         if (format === 'pdf') {
//             // 1. Handle PDF display
//             const blob = new Blob([response.data], { type: "application/pdf" });
//             const url = window.URL.createObjectURL(blob);
//             setPdfUrl(url);
//             showNotification("PDF generated and displayed in the viewer!", 'success');
//         } else {
//             // 2. Handle non-PDF download
//             const blob = new Blob([response.data], { type: response.headers['content-type'] });
//             const url = window.URL.createObjectURL(blob);
//             const contentDisposition = response.headers['content-disposition'];
            
//             let filename = `documentation.${format}`;
//             if (contentDisposition) {
//                 const filenameMatch = contentDisposition.match(/filename="(.+)"/);
//                 if (filenameMatch && filenameMatch[1]) {
//                     filename = filenameMatch[1];
//                 }
//             }

//             const a = document.createElement("a");
//             a.href = url;
//             a.download = filename;
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
            
//             showNotification(`${format.toUpperCase()} file downloaded successfully!`, 'success');
//         }

//     } catch (e) {
//         console.error("Export error:", e);
//         showNotification("Failed to export documentation. Check backend status.", 'error', 5000);
//     } finally {
//         setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-zinc-950 flex flex-col items-center p-4 font-space-grotesk">
//       <FontLoader />
//       <Notification {...notification} onClose={() => setNotification({ message: null, type: 'info' })} />
      
//       {/* Header Card */}
//       <div className="bg-zinc-900 p-8 rounded-xl shadow-2xl shadow-red-900/70 border border-red-600 w-full max-w-4xl mt-10 transition duration-300 hover:shadow-red-700/80">
//         <h1 
//             className="text-5xl font-black text-red-500 mb-1 tracking-widest uppercase flex items-center justify-center font-orbitron"
//             style={neonGlowStyle}
//         >
//             <FileText className="w-10 h-10 mr-2" /> CODEZEN
//         </h1>
//         <p className="text-zinc-100 mb-8 text-center text-xl font-normal tracking-wide">
//             Intelligent documentation Agent that evolves with every line of code
//         </p>

//         {/* Input and Fetch Section */}
//         <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
//             <div className="flex-grow w-full">
//                 <input
//                     type="text"
//                     placeholder="ENTER GITHUB REPO URL"
//                     value={repoUrl}
//                     onChange={(e) => setRepoUrl(e.target.value)}
//                     className="w-full p-4 border-2 border-red-700 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-inner shadow-black/50 font-space-grotesk"
//                     disabled={loading}
//                 />
//             </div>
//             <button 
//                 onClick={handleFetch}
//                 className="w-full sm:w-auto px-6 py-3 bg-red-700 text-white font-extrabold uppercase rounded-lg shadow-xl shadow-red-900/50 hover:bg-red-600 transition duration-200 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:shadow-none font-space-grotesk"
//                 disabled={loading}
//             >
//                 {loading && repoData === null ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Github className="w-5 h-5 mr-2" />}
//                 {loading && repoData === null ? 'FETCHING...' : 'FETCH REPO'}
//             </button>
//         </div>

//         {/* Status and Action Section */}
//         {repoData && (
//             <div className="bg-zinc-800 p-6 rounded-xl shadow-inner shadow-black/50 border border-red-800">
//                 <div className="flex justify-between items-center mb-4 border-b border-red-900 pb-3">
//                     <h3 className="text-xl font-extrabold text-red-500 flex items-center uppercase font-orbitron">
//                         <File className="w-5 h-5 mr-2" />
//                         Repository: <span className="font-mono text-base ml-2 p-1 bg-zinc-900 text-red-200 rounded-sm font-space-grotesk">{repoData.repo_name}</span>
//                     </h3>
//                     <p className="text-red-500 font-semibold text-lg font-space-grotesk">Files Found: {repoData.total_files}</p>
//                 </div>
                
//                 <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center pt-4">
//                     {/* Generate Docs Button (Primary Red Action) */}
//                     <button 
//                         onClick={handleGenerate}
//                         className="w-full md:w-auto flex-grow px-4 py-3 bg-red-700 text-white font-extrabold uppercase rounded-lg shadow-lg hover:bg-red-600 transition duration-200 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:shadow-none font-space-grotesk"
//                         disabled={loading}
//                     >
//                         <Bot className="w-5 h-5 mr-2" /> 
//                         {loading && repoData ? 'GENERATING...' : 'GENERATE DOCS'}
//                     </button>

//                     {/* Format Selector */}
//                     <select
//                         value={format}
//                         onChange={(e) => setFormat(e.target.value)}
//                         className="w-full md:w-auto px-4 py-3 border border-red-800 bg-zinc-900 text-zinc-100 font-semibold rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 font-space-grotesk"
//                         disabled={loading}
//                     >
//                         {FORMAT_OPTIONS.map(opt => (
//                             <option key={opt.key} value={opt.key}>{opt.label}</option>
//                         ))}
//                     </select>

//                     {/* Export Button (Rose/Secondary Red for download action) */}
//                     <button 
//                         onClick={handleExport}
//                         className="w-full md:w-auto flex-grow px-4 py-3 bg-rose-600 text-white font-extrabold uppercase rounded-lg shadow-lg hover:bg-rose-500 transition duration-200 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:shadow-none font-space-grotesk"
//                         disabled={loading || repoData.total_files === 0}
//                     >
//                         <Download className="w-5 h-5 mr-2" />
//                         {loading && !repoData ? 'LOADING...' : `EXPORT ${format.toUpperCase()}`}
//                     </button>
//                 </div>
//             </div>
//         )}
//       </div>

//       {/* PDF Viewer Section */}
//       {pdfUrl && format === 'pdf' && (
//         <div className="mt-8 w-full max-w-4xl">
//             <h2 className="text-2xl font-extrabold text-zinc-100 mb-4 flex items-center uppercase tracking-wider font-orbitron">
//                 <FileText className="w-6 h-6 mr-2 text-red-500" /> 
//                 LIVE PDF PREVIEW
//             </h2>
//             <div className="h-[80vh] w-full border-4 border-red-600 rounded-lg overflow-hidden shadow-2xl shadow-red-900/50">
//                 <iframe 
//                     src={pdfUrl} 
//                     className="w-full h-full bg-zinc-100" 
//                     title="Documentation PDF Preview"
//                     frameBorder="0"
//                 ></iframe>
//             </div>
//         </div>
//       )}

//       {/* Loading Overlay (Optional for better UX) */}
//       {loading && (
//           <div className="fixed inset-0 bg-zinc-950 bg-opacity-90 flex items-center justify-center z-40">
//               <div className="bg-zinc-900 p-8 rounded-xl shadow-2xl shadow-red-900/90 border border-red-700 flex flex-col items-center">
//                   <Loader2 className="w-8 h-8 mb-3 animate-spin text-red-500" />
//                   <p className="text-lg font-semibold text-zinc-100 uppercase tracking-wide font-space-grotesk">PROCESSING REQUEST...</p>
//               </div>
//           </div>
//       )}
//     </div>
//   );
// }

// export default App;

// import React, { useState } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import { Github, FileText, Bot, Download, Loader2, File, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

// const API_BASE = "http://127.0.0.1:8000";

// const neonGlowStyle = {
// textShadow: "0 0 4px #f87171, 0 0 10px #ef4444",
// };

// const FontLoader = () => (

//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Space+Grotesk:wght@300..700&display=swap');
//     .font-orbitron { font-family: 'Orbitron', sans-serif; }
//     .font-space-grotesk { font-family: 'Space Grotesk', sans-serif; }
//   `}</style>

// );

// const Notification = ({ message, type, onClose }) => {
// if (!message) return null;
// const baseClasses =
// "fixed top-4 right-4 p-4 rounded-xl shadow-2xl flex items-center z-50 transition-transform transform duration-300";
// let styleClasses = "";
// let Icon = AlertTriangle;
// switch (type) {
// case "success":
// styleClasses = "bg-green-500 text-white";
// break;
// case "error":
// styleClasses = "bg-red-500 text-white";
// break;
// case "info":
// default:
// styleClasses = "bg-blue-500 text-white";
// }
// return (
// <div className={`${baseClasses} ${styleClasses} animate-fade-in-down`}> <Icon className="w-5 h-5 mr-2" /> <span>{message}</span> <button onClick={onClose} className="ml-4 font-bold">
// × </button> </div>
// );
// };

// const FORMAT_OPTIONS = [
// { key: "pdf", label: "PDF Document" },
// { key: "docx", label: "Word Document" },
// { key: "md", label: "Markdown File" },
// { key: "html", label: "HTML Webpage" },
// { key: "txt", label: "Plain Text" },
// ];

// function App() {
// const [repoUrl, setRepoUrl] = useState("");
// const [analysis, setAnalysis] = useState([]);
// const [projectDoc, setProjectDoc] = useState("");
// const [format, setFormat] = useState("pdf");
// const [loading, setLoading] = useState(false);
// const [pdfUrl, setPdfUrl] = useState(null);
// const [acceptedSuggestions, setAccepted] = useState([]);
// const [rejectedSuggestions, setRejected] = useState([]);
// const [notification, setNotification] = useState({ message: null, type: "info" });


// const showNotification = (message, type = "info", duration = 3000) => {
// setNotification({ message, type });
// setTimeout(() => setNotification({ message: null, type: "info" }), duration);
// };

// const [statusMessage, setStatusMessage] = useState("Processing request...");
// const handleRunAgent = async () => {
//   if (!repoUrl) {
//     showNotification("Please enter a GitHub repository URL.", "error");
//     return;
//   }

//   setLoading(true);
//   setStatusMessage("🔍 Fetching repository (Perception Stage: Processing...)");
//   setPdfUrl(null);

//   try {
//     // Start perception
//     const response = await axios.post(`${API_BASE}/run-agent`, { repo_url: repoUrl });

//     setStatusMessage("🧠 Analyzing code (Reasoning Stage: Analyzing...)");
//     const result = response.data.result;

//     setAnalysis(result.analysis || []);
//     setStatusMessage("📄 Generating documentation (Documentation Stage: Generating Docs...)");

//     setProjectDoc(result.project_doc || "");
//     showNotification("Analysis completed successfully!", "success");
//   } catch (e) {
//     console.error(e);
//     showNotification("Error running AI Agent. Check backend.", "error", 5000);
//   } finally {
//     setLoading(false);
//   }
// };


// const handleAccept = (file, comment) => {
// setAccepted((prev) => [...prev, { file_name: file, comment, accepted: true }]);
// showNotification("Suggestion accepted!", "success");
// };

// const handleReject = (file, comment) => {
// setRejected((prev) => [...prev, { file_name: file, comment, accepted: false }]);
// showNotification("Suggestion rejected!", "error");
// };

// const handleApplyChanges = async () => {
//   if (acceptedSuggestions.length === 0 && rejectedSuggestions.length === 0) {
//     showNotification("Please accept or reject at least one suggestion first.", "error");
//     return;
//   }

//   setLoading(true);
//   setStatusMessage("⚙️ Applying accepted suggestions and committing code...");

//   try {
//     const response = await axios.post(`${API_BASE}/run-agent`, {
//       repo_url: repoUrl,
//       accepted_suggestions: acceptedSuggestions,
//       rejected_suggestions: rejectedSuggestions,
//       doc_format: "md",
//       user_id: "yash_2124",
//       commit_changes: true, // ✅ important flag
//     });

//     setStatusMessage("📄 Generating documentation (Documentation Stage: Generating Docs...)");
//     const result = response.data.result;

//     setAnalysis(result.analysis || []);
//     setProjectDoc(result.project_doc || "");
//     showNotification("Changes applied and committed successfully!", "success");
//   } catch (e) {
//     console.error(e);
//     showNotification("Error applying changes.", "error");
//   } finally {
//     setLoading(false);
//   }
// };


// const handleExport = async () => {
//   if (!projectDoc) {
//     showNotification("Please generate documentation first!", "error");
//     return;
//   }
//   setLoading(true);
//   try {
//     const response = await axios.post(
//       `${API_BASE}/export-docs`,
//       {
//         format,
//         docs: [{ file_name: "Project_Documentation", documentation: projectDoc }],
//       },
//       { responseType: "blob" }
//     );

//     if (format === "pdf") {
//       const blob = new Blob([response.data], { type: "application/pdf" });
//       const url = window.URL.createObjectURL(blob);
//       setPdfUrl(url);
//       showNotification("PDF ready for preview!", "success");
//     } else {
//       const blob = new Blob([response.data], { type: response.headers["content-type"] });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "CodeZen_Doc." + format; // ✅ fixed typo here
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//       showNotification(format.toUpperCase() + " file downloaded!", "success");
//     }
//   } catch (e) {
//     console.error(e);
//     showNotification("Export failed. Check backend.", "error");
//   } finally {
//     setLoading(false);
//   }
// };


// return ( <div className="min-h-screen bg-zinc-950 flex flex-col items-center p-4 font-space-grotesk"> <FontLoader />
// <Notification {...notification} onClose={() => setNotification({ message: null, type: "info" })} />

// ```
//   <div className="bg-zinc-900 p-8 rounded-xl shadow-2xl shadow-red-900/70 border border-red-600 w-full max-w-5xl mt-10 transition duration-300 hover:shadow-red-700/80">
//     <h1
//       className="text-5xl font-black text-red-500 mb-1 tracking-widest uppercase flex items-center justify-center font-orbitron"
//       style={neonGlowStyle}
//     >
//       <FileText className="w-10 h-10 mr-2" /> CODEZEN
//     </h1>
//     <p className="text-zinc-100 mb-8 text-center text-xl font-normal tracking-wide">
//       Intelligent Documentation Agent that evolves with every line of code
//     </p>

//     {/* Repo Input */}
//     <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
//       <input
//         type="text"
//         placeholder="ENTER GITHUB REPO URL"
//         value={repoUrl}
//         onChange={(e) => setRepoUrl(e.target.value)}
//         className="w-full p-4 border-2 border-red-700 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-inner shadow-black/50 font-space-grotesk"
//         disabled={loading}
//       />
//       <button
//         onClick={handleRunAgent}
//         className="w-full sm:w-auto px-6 py-3 bg-red-700 text-white font-extrabold uppercase rounded-lg shadow-xl shadow-red-900/50 hover:bg-red-600 transition duration-200 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:shadow-none"
//         disabled={loading}
//       >
//         {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Github className="w-5 h-5 mr-2" />}
//         {loading ? "RUNNING..." : "RUN AGENT"}
//       </button>
//     </div>

//     {/* Analysis Cards */}
//     {analysis.length > 0 && (
//       <div className="space-y-6">
//         <h2 className="text-2xl text-red-400 font-bold font-orbitron uppercase">Per-File AI Analysis</h2>
//         {analysis.map((file, idx) => (
//           <div key={idx} className="bg-zinc-800 p-5 rounded-lg border border-red-800 shadow-inner">
//             <h3 className="text-xl text-red-400 font-bold mb-2">{file.file}</h3>
//             <p className="text-gray-400 mb-3">{file.summary}</p>

//             <div className="mb-2">
//               <h4 className="text-red-400 font-semibold mb-1">Issues:</h4>
//               <ul className="list-disc ml-6 text-gray-300">
//                 {file.issues.map((issue, i) => (
//                   <li key={i}>{issue}</li>
//                 ))}
//               </ul>
//             </div>

//             <div>
//               <h4 className="text-green-400 font-semibold mb-1">Refactor Suggestions:</h4>
//               <ul className="list-disc ml-6 text-gray-300">
//                 {file.refactors.map((ref, i) => (
//                   <li key={i} className="flex justify-between items-center">
//                     <span>{ref}</span>
//                     <div className="space-x-2">
//                       <button
//                         onClick={() => handleAccept(file.file, ref)}
//                         className="bg-green-700 hover:bg-green-600 px-2 py-1 rounded text-white text-sm flex items-center"
//                       >
//                         <CheckCircle className="w-4 h-4 mr-1" /> Accept
//                       </button>
//                       <button
//                         onClick={() => handleReject(file.file, ref)}
//                         className="bg-red-700 hover:bg-red-600 px-2 py-1 rounded text-white text-sm flex items-center"
//                       >
//                         <XCircle className="w-4 h-4 mr-1" /> Reject
//                       </button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         ))}
//         <button
//           onClick={handleApplyChanges}
//           className="px-6 py-3 bg-green-700 hover:bg-green-600 rounded-lg text-white font-bold shadow-lg"
//           disabled={loading}
//         >
//           Apply Selected Suggestions
//         </button>
//       </div>
//     )}

//     {/* Project Documentation */}
//     {projectDoc && (
//       <div className="mt-8 bg-zinc-800 p-6 rounded-xl border border-red-800 shadow-inner">
//         <h2 className="text-2xl font-bold text-red-400 mb-3 font-orbitron uppercase">Project-Level Documentation</h2>
//         <div className="markdown-body bg-zinc-900 p-4 rounded-lg text-gray-200 overflow-auto max-h-[80vh]">
//           <ReactMarkdown>{projectDoc}</ReactMarkdown>
//         </div>
//       </div>
//     )}

//     {/* Export Options */}
//     {projectDoc && (
//       <div className="mt-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
//         <select
//           value={format}
//           onChange={(e) => setFormat(e.target.value)}
//           className="w-full sm:w-auto px-4 py-3 border border-red-800 bg-zinc-900 text-zinc-100 font-semibold rounded-lg"
//         >
//           {FORMAT_OPTIONS.map((opt) => (
//             <option key={opt.key} value={opt.key}>
//               {opt.label}
//             </option>
//           ))}
//         </select>
//         <button
//           onClick={handleExport}
//           className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-lg"
//           disabled={loading}
//         >
//           <Download className="w-5 h-5 mr-2 inline-block" /> Export {format.toUpperCase()}
//         </button>
//       </div>
//     )}
//   </div>

//   {/* PDF Viewer */}
//   {pdfUrl && (
//     <div className="mt-8 w-full max-w-5xl">
//       <h2 className="text-2xl font-extrabold text-zinc-100 mb-4 flex items-center uppercase tracking-wider font-orbitron">
//         <FileText className="w-6 h-6 mr-2 text-red-500" /> LIVE PDF PREVIEW
//       </h2>
//       <div className="h-[80vh] w-full border-4 border-red-600 rounded-lg overflow-hidden shadow-2xl shadow-red-900/50">
//         <iframe src={pdfUrl} className="w-full h-full bg-zinc-100" title="Documentation PDF Preview"></iframe>
//       </div>
//     </div>
//   )}

//   {loading && (
//     <div className="fixed inset-0 bg-zinc-950 bg-opacity-90 flex items-center justify-center z-40">
//       <div className="bg-zinc-900 p-8 rounded-xl shadow-2xl shadow-red-900/90 border border-red-700 flex flex-col items-center">
//         <Loader2 className="w-8 h-8 mb-3 animate-spin text-red-500" />
//         <p className="text-lg font-semibold text-zinc-100 uppercase tracking-wide font-space-grotesk">
//           PROCESSING REQUEST...
//         </p>
//       </div>
//     </div>
//   )}
// </div>

// );
// }

// export default App;


// import React, { useState } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import {
//   Github,
//   FileText,
//   Download,
//   Loader2,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";

// const API_BASE = "http://127.0.0.1:8000";

// const neonGlowStyle = {
//   textShadow: "0 0 4px #f87171, 0 0 10px #ef4444",
// };

// const FontLoader = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Space+Grotesk:wght@300..700&display=swap');
//     .font-orbitron { font-family: 'Orbitron', sans-serif; }
//     .font-space-grotesk { font-family: 'Space Grotesk', sans-serif; }
//   `}</style>
// );

// const Notification = ({ message, type, onClose }) => {
//   if (!message) return null;
//   const baseClasses =
//     "fixed top-4 right-4 p-4 rounded-xl shadow-2xl flex items-center z-50 transition-transform transform duration-300";
//   let styleClasses = "";
//   let Icon = AlertTriangle;
//   switch (type) {
//     case "success":
//       styleClasses = "bg-green-500 text-white";
//       break;
//     case "error":
//       styleClasses = "bg-red-500 text-white";
//       break;
//     case "info":
//     default:
//       styleClasses = "bg-blue-500 text-white";
//   }
//   return (
//     <div className={`${baseClasses} ${styleClasses} animate-fade-in-down`}>
//       <Icon className="w-5 h-5 mr-2" />
//       <span>{message}</span>
//       <button onClick={onClose} className="ml-4 font-bold">
//         ×
//       </button>
//     </div>
//   );
// };

// const FORMAT_OPTIONS = [
//   { key: "pdf", label: "PDF Document" },
//   { key: "docx", label: "Word Document" },
//   { key: "md", label: "Markdown File" },
//   { key: "html", label: "HTML Webpage" },
//   { key: "txt", label: "Plain Text" },
// ];

// function App() {
//   const [repoUrl, setRepoUrl] = useState("");
//   const [analysis, setAnalysis] = useState([]);
//   const [projectDoc, setProjectDoc] = useState("");
//   const [format, setFormat] = useState("pdf");
//   const [loading, setLoading] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [acceptedSuggestions, setAccepted] = useState([]);
//   const [rejectedSuggestions, setRejected] = useState([]);
//   const [notification, setNotification] = useState({
//     message: null,
//     type: "info",
//   });
//   const [statusMessage, setStatusMessage] = useState("Processing request...");

//   const showNotification = (message, type = "info", duration = 3000) => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification({ message: null, type: "info" }), duration);
//   };

//   const handleRunAgent = async () => {
//     if (!repoUrl) {
//       showNotification("Please enter a GitHub repository URL.", "error");
//       return;
//     }

//     setLoading(true);
//     setStatusMessage("🔍 Fetching repository (Perception Stage: Processing...)");
//     setPdfUrl(null);

//     try {
//       const response = await axios.post(`${API_BASE}/run-agent`, { repo_url: repoUrl });

//       setStatusMessage("🧠 Analyzing code (Reasoning Stage: Analyzing...)");
//       const result = response.data.result;

//       setAnalysis(result.analysis || []);
//       setStatusMessage("📄 Generating documentation (Documentation Stage: Generating Docs...)");
//       setProjectDoc(result.project_doc || "");
//       showNotification("Analysis completed successfully!", "success");
//     } catch (e) {
//       console.error(e);
//       showNotification("Error running AI Agent. Check backend.", "error", 5000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = (file, comment) => {
//     setAccepted((prev) => [...prev, { file_name: file, comment, accepted: true }]);
//     showNotification("Suggestion accepted!", "success");
//   };

//   const handleReject = (file, comment) => {
//     setRejected((prev) => [...prev, { file_name: file, comment, accepted: false }]);
//     showNotification("Suggestion rejected!", "error");
//   };

//   const handleAcceptAll = () => {
//     const all = [];
//     analysis.forEach((f) =>
//       f.refactors.forEach((r) => all.push({ file_name: f.file, comment: r, accepted: true }))
//     );
//     setAccepted(all);
//     showNotification("All suggestions accepted!", "success");
//   };

//   const handleApplyChanges = async () => {
//     if (acceptedSuggestions.length === 0 && rejectedSuggestions.length === 0) {
//       showNotification("Please accept or reject at least one suggestion first.", "error");
//       return;
//     }

//     setLoading(true);
//     setStatusMessage("⚙️ Applying accepted suggestions and committing code...");

//     try {
//       const response = await axios.post(`${API_BASE}/run-agent`, {
//         repo_url: repoUrl,
//         accepted_suggestions: acceptedSuggestions,
//         rejected_suggestions: rejectedSuggestions,
//         doc_format: "md",
//         user_id: "yash_2124",
//         commit_changes: true, // ✅ Important flag
//       });

//       setStatusMessage("📄 Generating documentation (Documentation Stage: Generating Docs...)");
//       const result = response.data.result;
//       setAnalysis(result.analysis || []);
//       setProjectDoc(result.project_doc || "");

//       showNotification("Changes applied and committed successfully!", "success");
//       setAccepted([]);
//       setRejected([]);
//     } catch (e) {
//       console.error(e);
//       showNotification("Error applying changes.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExport = async () => {
//     if (!projectDoc) {
//       showNotification("Please generate documentation first!", "error");
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${API_BASE}/export-docs`,
//         {
//           format,
//           docs: [{ file_name: "Project_Documentation", documentation: projectDoc }],
//         },
//         { responseType: "blob" }
//       );

//       if (format === "pdf") {
//         const blob = new Blob([response.data], { type: "application/pdf" });
//         const url = window.URL.createObjectURL(blob);
//         setPdfUrl(url);
//         showNotification("PDF ready for preview!", "success");
//       } else {
//         const blob = new Blob([response.data], {
//           type: response.headers["content-type"],
//         });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "CodeZen_Doc." + format;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         window.URL.revokeObjectURL(url);
//         showNotification(format.toUpperCase() + " file downloaded!", "success");
//       }
//     } catch (e) {
//       console.error(e);
//       showNotification("Export failed. Check backend.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-zinc-950 flex flex-col items-center p-4 font-space-grotesk">
//       <FontLoader />
//       <Notification {...notification} onClose={() => setNotification({ message: null, type: "info" })} />

//       <div className="bg-zinc-900 p-8 rounded-xl shadow-2xl shadow-red-900/70 border border-red-600 w-full max-w-5xl mt-10 transition duration-300 hover:shadow-red-700/80">
//         <h1
//           className="text-5xl font-black text-red-500 mb-1 tracking-widest uppercase flex items-center justify-center font-orbitron"
//           style={neonGlowStyle}
//         >
//           <FileText className="w-10 h-10 mr-2" /> CODEZEN
//         </h1>
//         <p className="text-zinc-100 mb-8 text-center text-xl font-normal tracking-wide">
//           Intelligent Documentation Agent that evolves with every line of code
//         </p>

//         {/* Repo Input */}
//         <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
//           <input
//             type="text"
//             placeholder="ENTER GITHUB REPO URL"
//             value={repoUrl}
//             onChange={(e) => setRepoUrl(e.target.value)}
//             className="w-full p-4 border-2 border-red-700 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-inner shadow-black/50 font-space-grotesk"
//             disabled={loading}
//           />
//           <button
//             onClick={handleRunAgent}
//             className="w-full sm:w-auto px-6 py-3 bg-red-700 text-white font-extrabold uppercase rounded-lg shadow-xl shadow-red-900/50 hover:bg-red-600 transition duration-200 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:shadow-none"
//             disabled={loading}
//           >
//             {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Github className="w-5 h-5 mr-2" />}
//             {loading ? "RUNNING..." : "RUN AGENT"}
//           </button>
//         </div>

//         {/* Analysis Cards */}
//         {analysis.length > 0 && (
//           <div className="space-y-6">
//             <h2 className="text-2xl text-red-400 font-bold font-orbitron uppercase">Per-File AI Analysis</h2>
//             {analysis.map((file, idx) => (
//               <div key={idx} className="bg-zinc-800 p-5 rounded-lg border border-red-800 shadow-inner">
//                 <h3 className="text-xl text-red-400 font-bold mb-2">{file.file}</h3>
//                 <p className="text-gray-400 mb-3">{file.summary}</p>

//                 <div className="mb-2">
//                   <h4 className="text-red-400 font-semibold mb-1">Issues:</h4>
//                   <ul className="list-disc ml-6 text-gray-300">
//                     {file.issues.map((issue, i) => (
//                       <li key={i}>{issue}</li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div>
//                   <h4 className="text-green-400 font-semibold mb-1">Refactor Suggestions:</h4>
//                   <ul className="list-disc ml-6 text-gray-300">
//                     {file.refactors.map((ref, i) => (
//                       <li key={i} className="flex justify-between items-center">
//                         <span>{ref}</span>
//                         <div className="space-x-2">
//                           <button
//                             onClick={() => handleAccept(file.file, ref)}
//                             className="bg-green-700 hover:bg-green-600 px-2 py-1 rounded text-white text-sm flex items-center"
//                           >
//                             <CheckCircle className="w-4 h-4 mr-1" /> Accept
//                           </button>
//                           <button
//                             onClick={() => handleReject(file.file, ref)}
//                             className="bg-red-700 hover:bg-red-600 px-2 py-1 rounded text-white text-sm flex items-center"
//                           >
//                             <XCircle className="w-4 h-4 mr-1" /> Reject
//                           </button>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//             <div className="flex space-x-4">
//               <button
//                 onClick={handleAcceptAll}
//                 className="px-6 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg text-white font-bold shadow-lg"
//                 disabled={loading}
//               >
//                 Accept All Suggestions
//               </button>
//               <button
//                 onClick={handleApplyChanges}
//                 className="px-6 py-3 bg-green-700 hover:bg-green-600 rounded-lg text-white font-bold shadow-lg"
//                 disabled={loading}
//               >
//                 Apply Selected Suggestions
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Project Documentation */}
//         {projectDoc && (
//           <div className="mt-8 bg-zinc-800 p-6 rounded-xl border border-red-800 shadow-inner">
//             <h2 className="text-2xl font-bold text-red-400 mb-3 font-orbitron uppercase">
//               Project-Level Documentation
//             </h2>
//             <div className="markdown-body bg-zinc-900 p-4 rounded-lg text-gray-200 overflow-auto max-h-[80vh]">
//               <ReactMarkdown>{projectDoc}</ReactMarkdown>
//             </div>
//           </div>
//         )}

//         {/* Export Options */}
//         {projectDoc && (
//           <div className="mt-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
//             <select
//               value={format}
//               onChange={(e) => setFormat(e.target.value)}
//               className="w-full sm:w-auto px-4 py-3 border border-red-800 bg-zinc-900 text-zinc-100 font-semibold rounded-lg"
//             >
//               {FORMAT_OPTIONS.map((opt) => (
//                 <option key={opt.key} value={opt.key}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={handleExport}
//               className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-lg"
//               disabled={loading}
//             >
//               <Download className="w-5 h-5 mr-2 inline-block" /> Export {format.toUpperCase()}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* PDF Viewer */}
//       {pdfUrl && (
//         <div className="mt-8 w-full max-w-5xl">
//           <h2 className="text-2xl font-extrabold text-zinc-100 mb-4 flex items-center uppercase tracking-wider font-orbitron">
//             <FileText className="w-6 h-6 mr-2 text-red-500" /> LIVE PDF PREVIEW
//           </h2>
//           <div className="h-[80vh] w-full border-4 border-red-600 rounded-lg overflow-hidden shadow-2xl shadow-red-900/50">
//             <iframe src={pdfUrl} className="w-full h-full bg-zinc-100" title="Documentation PDF Preview"></iframe>
//           </div>
//         </div>
//       )}

//       {/* Dynamic Loader Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-zinc-950 bg-opacity-90 flex items-center justify-center z-40">
//           <div className="bg-zinc-900 p-8 rounded-xl shadow-2xl shadow-red-900/90 border border-red-700 flex flex-col items-center">
//             <Loader2 className="w-8 h-8 mb-3 animate-spin text-red-500" />
//             <p className="text-lg font-semibold text-zinc-100 uppercase tracking-wide font-space-grotesk text-center max-w-md">
//               {statusMessage}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

// import React, { useState } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import { Github, FileText, Download, Loader2, File, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

// const API_BASE = "http://127.0.0.1:8000";

// const neonGlowStyle = { textShadow: "0 0 4px #f87171, 0 0 10px #ef4444" };

// const FontLoader = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Space+Grotesk:wght@300..700&display=swap');
//     .font-orbitron { font-family: 'Orbitron', sans-serif; }
//     .font-space-grotesk { font-family: 'Space Grotesk', sans-serif; }
//   `}</style>
// );

// const Notification = ({ message, type, onClose }) => {
//   if (!message) return null;
//   const baseClasses = "fixed top-4 right-4 p-4 rounded-xl shadow-2xl flex items-center z-50 transition-transform transform duration-300";
//   let styleClasses = "";
//   let Icon = AlertTriangle;
//   switch (type) {
//     case "success": styleClasses = "bg-green-500 text-white"; break;
//     case "error": styleClasses = "bg-red-500 text-white"; break;
//     default: styleClasses = "bg-blue-500 text-white";
//   }
//   return (
//     <div className={`${baseClasses} ${styleClasses} animate-fade-in-down`}>
//       <Icon className="w-5 h-5 mr-2" />
//       <span>{message}</span>
//       <button onClick={onClose} className="ml-4 font-bold">×</button>
//     </div>
//   );
// };

// const FORMAT_OPTIONS = [
//   { key: "pdf", label: "PDF Document" },
//   { key: "docx", label: "Word Document" },
//   { key: "md", label: "Markdown File" },
//   { key: "html", label: "HTML Webpage" },
//   { key: "txt", label: "Plain Text" },
// ];

// function App() {
//   const [repoUrl, setRepoUrl] = useState("");
//   const [analysis, setAnalysis] = useState([]);
//   const [projectDoc, setProjectDoc] = useState("");
//   const [format, setFormat] = useState("pdf");
//   const [loading, setLoading] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [acceptedSuggestions, setAccepted] = useState([]);
//   const [rejectedSuggestions, setRejected] = useState([]);
//   const [notification, setNotification] = useState({ message: null, type: "info" });
//   const [statusMessage, setStatusMessage] = useState("");

//   const showNotification = (message, type = "info", duration = 2500) => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification({ message: null, type: "info" }), duration);
//   };

//   // --- Stage 1+2: Perception + Reasoning (analysis only) ---
//   const handleRunAnalysis = async () => {
//     if (!repoUrl) {
//       showNotification("Please enter a GitHub repository URL.", "error");
//       return;
//     }

//   const handleGitHubLogin = () => {
//     window.location.href = "http://localhost:8000/login/github";
//     };

//     setProjectDoc("");
//     setAnalysis([]);
//     setAccepted([]);
//     setRejected([]);
//     setPdfUrl(null);

//     try {
//       setLoading(true);
//       setStatusMessage("🌐 Fetching repository (Perception Stage: Processing...)");
//       const res = await axios.post(`${API_BASE}/run-analysis`, { repo_url: repoUrl });

//       setStatusMessage("🧠 Analyzing code (Reasoning Stage: Analyzing...)");
//       const result = res.data.result;
//       setAnalysis(result.analysis || []);

//       // Finish Stage 2
//       setStatusMessage("📝 Review suggestions and decide (Accept / Reject).");
//       showNotification("Analysis is ready. Review suggestions below.", "success");
//     } catch (e) {
//       console.error(e);
//       showNotification("Error running analysis. Check backend.", "error", 4000);
//       setStatusMessage("❌ Failed during analysis.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = (file, comment = "") => {
//     setAccepted((prev) => [...prev, { file_name: file, comment, accepted: true }]);
//     showNotification(`Accepted for ${file}`, "success");
//   };

//   const handleReject = (file, comment = "") => {
//     setRejected((prev) => [...prev, { file_name: file, comment, accepted: false }]);
//     showNotification(`Rejected for ${file}`, "error");
//   };

//   const handleAcceptAll = () => {
//     const bulk = analysis.flatMap(f =>
//       (f.refactors || []).map(ref => ({ file_name: f.file, comment: ref, accepted: true }))
//     );
//     setAccepted(bulk);
//     showNotification("All suggestions marked as accepted.", "success");
//   };

//   const handleRejectAll = () => {
//     const bulk = analysis.flatMap(f =>
//       (f.refactors || []).map(ref => ({ file_name: f.file, comment: ref, accepted: false }))
//     );
//     setRejected(bulk);
//     showNotification("All suggestions marked as rejected.", "error");
//   };

//   // --- Stage 3+4: Apply changes (optional) + Docs ---
//   const handleApplyChanges = async () => {
//     if (acceptedSuggestions.length === 0 && rejectedSuggestions.length === 0) {
//       // Scenario B triggers docs w/o commits
//       setStatusMessage("📚 Generating documentation (Documentation Stage: Generating Docs...)");
//     } else {
//       setStatusMessage("⚙️ Applying accepted suggestions and committing code...");
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post(`${API_BASE}/apply-changes`, {
//         repo_url: repoUrl,
//         accepted_suggestions: acceptedSuggestions,
//         rejected_suggestions: rejectedSuggestions,
//         doc_format: "md",
//         user_id: "yash_2124",
//         commit_changes: acceptedSuggestions.length > 0, // commit only if something accepted
//       });

//       setStatusMessage("📚 Generating documentation (Documentation Stage: Generating Docs...)");
//       const result = res.data.result;
//       setAnalysis(result.analysis || []);
//       setProjectDoc(result.project_doc || "");

//       setStatusMessage("✅ Done! Ready for preview.");
//       showNotification("Documentation generated.", "success");
//     } catch (e) {
//       console.error(e);
//       showNotification("Error applying changes or generating docs.", "error");
//       setStatusMessage("❌ Failed during apply/generate.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExport = async () => {
//     if (!projectDoc) {
//       showNotification("Please generate documentation first!", "error");
//       return;
//     }
//     try {
//       setLoading(true);
//       const res = await axios.post(`${API_BASE}/export-docs`, {
//         format,
//         docs: [{ file_name: "Project_Documentation", documentation: projectDoc }],
//       }, { responseType: "blob" });

//       if (format === "pdf") {
//         const blob = new Blob([res.data], { type: "application/pdf" });
//         const url = window.URL.createObjectURL(blob);
//         setPdfUrl(url);
//         showNotification("PDF ready for preview!", "success");
//       } else {
//         const blob = new Blob([res.data], { type: res.headers["content-type"] });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "CodeZen_Doc." + format;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         window.URL.revokeObjectURL(url);
//         showNotification(format.toUpperCase() + " file downloaded!", "success");
//       }
//     } catch (e) {
//       console.error(e);
//       showNotification("Export failed. Check backend.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-zinc-950 flex flex-col items-center p-4 font-space-grotesk">
//       <FontLoader />
//       <Notification {...notification} onClose={() => setNotification({ message: null, type: "info" })} />

//       {/* Header */}
//       <div className="bg-zinc-900 p-8 rounded-xl shadow-2xl shadow-red-900/70 border border-red-600 w-full max-w-5xl mt-10">
//         <h1 className="text-5xl font-black text-red-500 mb-1 tracking-widest uppercase flex items-center justify-center font-orbitron" style={neonGlowStyle}>
//           <FileText className="w-10 h-10 mr-2" /> CODEZEN
//         </h1>
//         <p className="text-zinc-100 mb-2 text-center text-xl">Intelligent Documentation Agent that evolves with every line of code</p>
//         {statusMessage && <p className="text-red-300 text-center mb-6">{statusMessage}</p>}

//         {/* Repo input */}
//         <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
//           <input
//             type="text"
//             placeholder="ENTER GITHUB REPO URL (e.g., https://github.com/mdn/js-examples)"
//             value={repoUrl}
//             onChange={(e) => setRepoUrl(e.target.value)}
//             className="w-full p-4 border-2 border-red-700 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-red-500"
//             disabled={loading}
//           />
//           <button
//             onClick={handleRunAnalysis}
//             className="w-full sm:w-auto px-6 py-3 bg-red-700 text-white font-extrabold uppercase rounded-lg shadow-xl hover:bg-red-600 disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? <Loader2 className="w-5 h-5 mr-2 inline-block animate-spin" /> : <Github className="w-5 h-5 mr-2 inline-block" />}
//             {loading ? "RUNNING..." : "RUN ANALYSIS"}
//           </button>
//         </div>

//         {/* Analysis cards */}
//         {analysis.length > 0 && (
//           <div className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h2 className="text-2xl text-red-400 font-bold font-orbitron uppercase">Per-File AI Analysis</h2>
//               <div className="space-x-2">
//                 <button onClick={handleAcceptAll} className="px-3 py-2 bg-green-700 hover:bg-green-600 rounded text-white text-sm">
//                   Accept All
//                 </button>
//                 <button onClick={handleRejectAll} className="px-3 py-2 bg-red-700 hover:bg-red-600 rounded text-white text-sm">
//                   Reject All
//                 </button>
//               </div>
//             </div>

//             {analysis.map((file, idx) => (
//               <div key={idx} className="bg-zinc-800 p-5 rounded-lg border border-red-800 shadow-inner">
//                 <h3 className="text-xl text-red-400 font-bold mb-2">{file.file}</h3>
//                 <p className="text-gray-400 mb-3">{file.summary}</p>

//                 <div className="mb-2">
//                   <h4 className="text-red-400 font-semibold mb-1">Issues:</h4>
//                   <ul className="list-disc ml-6 text-gray-300">
//                     {(file.issues || []).map((issue, i) => (<li key={i}>{issue}</li>))}
//                   </ul>
//                 </div>

//                 <div>
//                   <h4 className="text-green-400 font-semibold mb-1">Refactor Suggestions:</h4>
//                   <ul className="list-disc ml-6 text-gray-300">
//                     {(file.refactors || []).map((ref, i) => (
//                       <li key={i} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
//                         <span className="flex-1">{ref}</span>
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => handleAccept(file.file, ref)}
//                             className="bg-green-700 hover:bg-green-600 px-2 py-1 rounded text-white text-sm flex items-center"
//                           >
//                             <CheckCircle className="w-4 h-4 mr-1" /> Accept
//                           </button>
//                           <button
//                             onClick={() => handleReject(file.file, ref)}
//                             className="bg-red-700 hover:bg-red-600 px-2 py-1 rounded text-white text-sm flex items-center"
//                           >
//                             <XCircle className="w-4 h-4 mr-1" /> Reject
//                           </button>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}

//             <button
//               onClick={handleApplyChanges}
//               className="px-6 py-3 bg-green-700 hover:bg-green-600 rounded-lg text-white font-bold shadow-lg"
//               disabled={loading}
//             >
//               Apply Selected Suggestions
//             </button>
//           </div>
//         )}

//         {/* Docs preview */}
//         {projectDoc && (
//           <div className="mt-8 bg-zinc-800 p-6 rounded-xl border border-red-800 shadow-inner">
//             <h2 className="text-2xl font-bold text-red-400 mb-3 font-orbitron uppercase">Project-Level Documentation</h2>
//             <div className="markdown-body bg-zinc-900 p-4 rounded-lg text-gray-200 overflow-auto max-h-[80vh]">
//               <ReactMarkdown>{projectDoc}</ReactMarkdown>
//             </div>
//           </div>
//         )}

//         {/* Export */}
//         {projectDoc && (
//           <div className="mt-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
//             <select
//               value={format}
//               onChange={(e) => setFormat(e.target.value)}
//               className="w-full sm:w-auto px-4 py-3 border border-red-800 bg-zinc-900 text-zinc-100 font-semibold rounded-lg"
//             >
//               {FORMAT_OPTIONS.map((opt) => (
//                 <option key={opt.key} value={opt.key}>{opt.label}</option>
//               ))}
//             </select>
//             <button
//               onClick={handleExport}
//               className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-lg"
//               disabled={loading}
//             >
//               <Download className="w-5 h-5 mr-2 inline-block" /> Export {format.toUpperCase()}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* PDF Viewer */}
//       {pdfUrl && (
//         <div className="mt-8 w-full max-w-5xl">
//           <h2 className="text-2xl font-extrabold text-zinc-100 mb-4 flex items-center uppercase tracking-wider font-orbitron">
//             <FileText className="w-6 h-6 mr-2 text-red-500" /> LIVE PDF PREVIEW
//           </h2>
//           <div className="h-[80vh] w-full border-4 border-red-600 rounded-lg overflow-hidden shadow-2xl shadow-red-900/50">
//             <iframe src={pdfUrl} className="w-full h-full bg-zinc-100" title="Documentation PDF Preview" />
//           </div>
//         </div>
//       )}

//       {/* Loading overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-zinc-950 bg-opacity-90 flex items-center justify-center z-40">
//           <div className="bg-zinc-900 p-8 rounded-xl shadow-2xl shadow-red-900/90 border border-red-700 flex flex-col items-center">
//             <Loader2 className="w-8 h-8 mb-3 animate-spin text-red-500" />
//             <p className="text-lg font-semibold text-zinc-100 uppercase tracking-wide font-space-grotesk">
//               {statusMessage || "PROCESSING REQUEST..."}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import {
//   Github,
//   FileText,
//   Download,
//   Loader2,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";

// const API_BASE = "http://127.0.0.1:8000";
// const neonGlowStyle = { textShadow: "0 0 4px #f87171, 0 0 10px #ef4444" };

// const FontLoader = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Space+Grotesk:wght@300..700&display=swap');
//     .font-orbitron { font-family: 'Orbitron', sans-serif; }
//     .font-space-grotesk { font-family: 'Space Grotesk', sans-serif; }
//   `}</style>
// );

// const Notification = ({ message, type, onClose }) => {
//   if (!message) return null;
//   const baseClasses =
//     "fixed top-4 right-4 p-4 rounded-xl shadow-2xl flex items-center z-50 transition-transform transform duration-300";
//   let styleClasses = "";
//   let Icon = AlertTriangle;

//   switch (type) {
//     case "success":
//       styleClasses = "bg-green-500 text-white";
//       break;
//     case "error":
//       styleClasses = "bg-red-500 text-white";
//       break;
//     default:
//       styleClasses = "bg-blue-500 text-white";
//   }

//   return (
//     <div className={`${baseClasses} ${styleClasses} animate-fade-in-down`}>
//       <Icon className="w-5 h-5 mr-2" />
//       <span>{message}</span>
//       <button onClick={onClose} className="ml-4 font-bold">
//         ×
//       </button>
//     </div>
//   );
// };

// const FORMAT_OPTIONS = [
//   { key: "pdf", label: "PDF Document" },
//   { key: "docx", label: "Word Document" },
//   { key: "md", label: "Markdown File" },
//   { key: "html", label: "HTML Webpage" },
//   { key: "txt", label: "Plain Text" },
// ];

// function App() {
//   const [repoUrl, setRepoUrl] = useState("");
//   const [analysis, setAnalysis] = useState([]);
//   const [projectDoc, setProjectDoc] = useState("");
//   const [format, setFormat] = useState("pdf");
//   const [loading, setLoading] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [acceptedSuggestions, setAccepted] = useState([]);
//   const [rejectedSuggestions, setRejected] = useState([]);
//   const [notification, setNotification] = useState({
//     message: null,
//     type: "info",
//   });
//   const [statusMessage, setStatusMessage] = useState("");
//   const [githubConnected, setGithubConnected] = useState(false);

//   const showNotification = (message, type = "info", duration = 2500) => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification({ message: null, type: "info" }), duration);
//   };

//   // 🔹 Step 1: GitHub Login Redirect
//   const handleGitHubLogin = () => {
//     window.location.href = "http://127.0.0.1:8000/login/github";
//   };

//   // 🔹 Logout helper (clear expired token)
//   const handleGitHubLogout = () => {
//    localStorage.removeItem("github_token");
//    setGithubConnected(false);
//    showNotification("GitHub session expired. Please sign in again.", "error");
//  };

//   // 🔹 Step 2: Capture OAuth Token
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get("token");
//     if (token) {
//       localStorage.setItem("github_token", token);
//       showNotification("GitHub connected successfully!", "success");
//       setGithubConnected(true);
//       window.history.replaceState({}, document.title, "/");
//     } else if (localStorage.getItem("github_token")) {
//       setGithubConnected(true);
//     }
//   }, []);

//   // --- Stage 1+2: Perception + Reasoning (analysis only) ---
//   const handleRunAnalysis = async () => {
//     if (!repoUrl) {
//       showNotification("Please enter a GitHub repository URL.", "error");
//       return;
//     }

//     setProjectDoc("");
//     setAnalysis([]);
//     setAccepted([]);
//     setRejected([]);
//     setPdfUrl(null);

//     try {
//       setLoading(true);
//       setStatusMessage("🌐 Fetching repository (Perception Stage: Processing...)");
//       const res = await axios.post(`${API_BASE}/run-analysis`, { repo_url: repoUrl });

//       setStatusMessage("🧠 Analyzing code (Reasoning Stage: Analyzing...)");
//       const result = res.data.result;
//       setAnalysis(result.analysis || []);

//       setStatusMessage("📝 Review suggestions and decide (Accept / Reject).");
//       showNotification("Analysis complete! Review suggestions below.", "success");
//     } catch (e) {
//       console.error(e);
//       showNotification("Error running analysis. Check backend.", "error", 4000);
//       setStatusMessage("❌ Failed during analysis.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = (file, comment = "") => {
//     setAccepted((prev) => [...prev, { file_name: file, comment, accepted: true }]);
//     showNotification(`Accepted for ${file}`, "success");
//   };

//   const handleReject = (file, comment = "") => {
//     setRejected((prev) => [...prev, { file_name: file, comment, accepted: false }]);
//     showNotification(`Rejected for ${file}`, "error");
//   };

//   const handleAcceptAll = () => {
//     const bulk = analysis.flatMap((f) =>
//       (f.refactors || []).map((ref) => ({ file_name: f.file, comment: ref, accepted: true }))
//     );
//     setAccepted(bulk);
//     showNotification("All suggestions marked as accepted.", "success");
//   };

//   const handleRejectAll = () => {
//     const bulk = analysis.flatMap((f) =>
//       (f.refactors || []).map((ref) => ({ file_name: f.file, comment: ref, accepted: false }))
//     );
//     setRejected(bulk);
//     showNotification("All suggestions marked as rejected.", "error");
//   };

//   // --- Stage 3+4: Apply Changes + Docs ---
//  const handleApplyChanges = async () => {
//   const token = localStorage.getItem("github_token");
//   if (!token) {
//     showNotification("Please sign in with GitHub first!", "error");
//     return;
//   }

//   if (acceptedSuggestions.length === 0 && rejectedSuggestions.length === 0) {
//     setStatusMessage("📚 Generating documentation (Documentation Stage: Generating Docs...)");
//   } else {
//     setStatusMessage("⚙️ Applying accepted suggestions and committing code...");
//   }

//   try {
//     setLoading(true);
//     const res = await axios.post(`${API_BASE}/apply-changes`, {
//       repo_url: repoUrl,
//       accepted_suggestions: acceptedSuggestions,
//       rejected_suggestions: rejectedSuggestions,
//       doc_format: "md",
//       user_id: "yash_2124",
//       commit_changes: acceptedSuggestions.length > 0,
//       auth_token: token,
//     });

//     const result = res.data.result;
//     setAnalysis(result.analysis || []);
//     setProjectDoc(result.project_doc || "");
//     setStatusMessage("✅ Done! Documentation ready.");
//     showNotification("Documentation generated successfully.", "success");
//   } catch (e) {
//     console.error(e);

//     // 🧠 Detect token expiry from backend message
//     if (
//       e.response?.data?.detail?.includes("expired") ||
//       e.response?.data?.detail?.includes("re-login")
//     ) {
//       handleGitHubLogout(); // clear token + notify user
//     } else {
//       showNotification("Error applying changes or generating docs.", "error");
//     }

//     setStatusMessage("❌ Failed during apply/generate.");
//   } finally {
//     setLoading(false);
//   }
// };


//   const handleExport = async () => {
//     if (!projectDoc) {
//       showNotification("Please generate documentation first!", "error");
//       return;
//     }
//     try {
//       setLoading(true);
//       const res = await axios.post(
//         `${API_BASE}/export-docs`,
//         {
//           format,
//           docs: [{ file_name: "Project_Documentation", documentation: projectDoc }],
//         },
//         { responseType: "blob" }
//       );

//       const blob = new Blob([res.data], { type: res.headers["content-type"] });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "CodeZen_Doc." + format;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);

//       showNotification(`${format.toUpperCase()} file downloaded!`, "success");
//     } catch (e) {
//       console.error(e);
//       showNotification("Export failed. Check backend.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-zinc-950 flex flex-col items-center p-4 font-space-grotesk">
//       <FontLoader />
//       <Notification {...notification} onClose={() => setNotification({ message: null, type: "info" })} />

//       <div className="bg-zinc-900 p-8 rounded-xl shadow-2xl shadow-red-900/70 border border-red-600 w-full max-w-5xl mt-10">
//         <h1
//           className="text-5xl font-black text-red-500 mb-1 tracking-widest uppercase flex items-center justify-center font-orbitron"
//           style={neonGlowStyle}
//         >
//           <FileText className="w-10 h-10 mr-2" /> CODEZEN
//         </h1>

//         <p className="text-zinc-100 mb-2 text-center text-xl">
//           Intelligent Documentation Agent that evolves with every line of code
//         </p>

//         {statusMessage && <p className="text-red-300 text-center mb-6">{statusMessage}</p>}

//         {/* GitHub Login Section */}
//         <div className="flex justify-center mb-6">
//             {!githubConnected ? (
//              <button
//               onClick={handleGitHubLogin}
//               className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg flex items-center shadow-lg"
//              >
//                 <Github className="w-5 h-5 mr-2" /> Sign in with GitHub
//             </button>
//         ) : (
//           <div className="flex items-center gap-3 text-green-400 font-semibold">
//             <CheckCircle className="w-5 h-5" />
//             Connected to GitHub
//            <button
//              onClick={handleGitHubLogout}
//              className="ml-2 px-3 py-1 text-sm text-red-400 border border-red-500 rounded hover:bg-red-500/10"
//            >
//             Logout
//            </button>
//           </div>
//          )}
//         </div>


//         {/* Repo input */}
//         <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
//           <input
//             type="text"
//             placeholder="ENTER GITHUB REPO URL (e.g., https://github.com/mdn/js-examples)"
//             value={repoUrl}
//             onChange={(e) => setRepoUrl(e.target.value)}
//             className="w-full p-4 border-2 border-red-700 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-red-500"
//             disabled={loading}
//           />
//           <button
//             onClick={handleRunAnalysis}
//             className="w-full sm:w-auto px-6 py-3 bg-red-700 text-white font-extrabold uppercase rounded-lg shadow-xl hover:bg-red-600 disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? (
//               <Loader2 className="w-5 h-5 mr-2 inline-block animate-spin" />
//             ) : (
//               <Github className="w-5 h-5 mr-2 inline-block" />
//             )}
//             {loading ? "RUNNING..." : "RUN ANALYSIS"}
//           </button>
//         </div>

//         {/* Analysis Cards */}
//         {analysis.length > 0 && (
//           <div className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h2 className="text-2xl text-red-400 font-bold font-orbitron uppercase">Per-File AI Analysis</h2>
//               <div className="space-x-2">
//                 <button onClick={handleAcceptAll} className="px-3 py-2 bg-green-700 hover:bg-green-600 rounded text-white text-sm">
//                   Accept All
//                 </button>
//                 <button onClick={handleRejectAll} className="px-3 py-2 bg-red-700 hover:bg-red-600 rounded text-white text-sm">
//                   Reject All
//                 </button>
//               </div>
//             </div>

//             {analysis.map((file, idx) => (
//               <div key={idx} className="bg-zinc-800 p-5 rounded-lg border border-red-800 shadow-inner">
//                 <h3 className="text-xl text-red-400 font-bold mb-2">{file.file}</h3>
//                 <p className="text-gray-400 mb-3">{file.summary}</p>

//                 <div className="mb-2">
//                   <h4 className="text-red-400 font-semibold mb-1">Issues:</h4>
//                   <ul className="list-disc ml-6 text-gray-300">
//                     {(file.issues || []).map((issue, i) => (
//                       <li key={i}>{issue}</li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div>
//                   <h4 className="text-green-400 font-semibold mb-1">Refactor Suggestions:</h4>
//                   <ul className="list-disc ml-6 text-gray-300">
//                     {(file.refactors || []).map((ref, i) => (
//                       <li key={i} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
//                         <span className="flex-1">{ref}</span>
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => handleAccept(file.file, ref)}
//                             className="bg-green-700 hover:bg-green-600 px-2 py-1 rounded text-white text-sm flex items-center"
//                           >
//                             <CheckCircle className="w-4 h-4 mr-1" /> Accept
//                           </button>
//                           <button
//                             onClick={() => handleReject(file.file, ref)}
//                             className="bg-red-700 hover:bg-red-600 px-2 py-1 rounded text-white text-sm flex items-center"
//                           >
//                             <XCircle className="w-4 h-4 mr-1" /> Reject
//                           </button>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}

//             <button
//               onClick={handleApplyChanges}
//               className="px-6 py-3 bg-green-700 hover:bg-green-600 rounded-lg text-white font-bold shadow-lg"
//               disabled={loading}
//             >
//               Apply Selected Suggestions
//             </button>
//           </div>
//         )}

//         {/* Documentation */}
//         {projectDoc && (
//           <div className="mt-8 bg-zinc-800 p-6 rounded-xl border border-red-800 shadow-inner">
//             <h2 className="text-2xl font-bold text-red-400 mb-3 font-orbitron uppercase">
//               Project-Level Documentation
//             </h2>
//             <div className="markdown-body bg-zinc-900 p-4 rounded-lg text-gray-200 overflow-auto max-h-[80vh]">
//               <ReactMarkdown>{projectDoc}</ReactMarkdown>
//             </div>
//           </div>
//         )}

//         {/* Export */}
//         {projectDoc && (
//           <div className="mt-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
//             <select
//               value={format}
//               onChange={(e) => setFormat(e.target.value)}
//               className="w-full sm:w-auto px-4 py-3 border border-red-800 bg-zinc-900 text-zinc-100 font-semibold rounded-lg"
//             >
//               {FORMAT_OPTIONS.map((opt) => (
//                 <option key={opt.key} value={opt.key}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={handleExport}
//               className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-lg"
//               disabled={loading}
//             >
//               <Download className="w-5 h-5 mr-2 inline-block" /> Export {format.toUpperCase()}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Loading overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-zinc-950 bg-opacity-90 flex items-center justify-center z-40">
//           <div className="bg-zinc-900 p-8 rounded-xl shadow-2xl shadow-red-900/90 border border-red-700 flex flex-col items-center">
//             <Loader2 className="w-8 h-8 mb-3 animate-spin text-red-500" />
//             <p className="text-lg font-semibold text-zinc-100 uppercase tracking-wide font-space-grotesk">
//               {statusMessage || "PROCESSING REQUEST..."}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import {
//   Github,
//   FileText,
//   Download,
//   Loader2,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";

// const API_BASE = "http://127.0.0.1:8000";

// const neonGlowStyle = { textShadow: "0 0 4px #f87171, 0 0 10px #ef4444" };

// // Font loader placeholder
// const FontLoader = () => null;

// // Notification toast
// const Notification = ({ message, type, onClose }) => {
//   if (!message) return null;

//   const base =
//     "fixed top-4 right-4 p-4 rounded-xl shadow-2xl flex items-center z-50 transition-transform transform duration-300";

//   const style =
//     type === "success"
//       ? "bg-green-700 text-white"
//       : type === "error"
//       ? "bg-red-700 text-white"
//       : "bg-blue-700 text-white";

//   return (
//     <div className={`${base} ${style} animate-fade-in-down`}>
//       <div className="mr-3">
//         {type === "success" && <CheckCircle className="w-5 h-5" />}
//         {type === "error" && <XCircle className="w-5 h-5" />}
//         {type === "info" && <AlertTriangle className="w-5 h-5" />}
//       </div>
//       {message}
//       <button onClick={onClose} className="ml-4 text-xl font-bold opacity-80 hover:opacity-100">
//         &times;
//       </button>
//     </div>
//   );
// };

// const FORMAT_OPTIONS = [
//   { key: "pdf", label: "PDF Document" },
//   { key: "docx", label: "Word Document" },
//   { key: "md", label: "Markdown File" },
//   { key: "html", label: "HTML Webpage" },
//   { key: "txt", label: "Plain Text" },
// ];

// function App() {
//   const [repoUrl, setRepoUrl] = useState("");
//   const [analysis, setAnalysis] = useState([]);
//   const [projectDoc, setProjectDoc] = useState("");
//   const [format, setFormat] = useState("pdf");
//   const [loading, setLoading] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState(null); // Unused state, but kept for completeness
//   const [acceptedSuggestions, setAccepted] = useState([]);
//   const [rejectedSuggestions, setRejected] = useState([]);
//   const [notification, setNotification] = useState({ message: null, type: "info" });
//   const [statusMessage, setStatusMessage] = useState("");
//   const [githubConnected, setGithubConnected] = useState(false);
//   const [showAnalysis, setShowAnalysis] = useState(true);

//   // 🧠 Simple notification handler
//   const showNotification = (message, type = "info", duration = 2500) => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification({ message: null, type: "info" }), duration);
//   };

//   // 🧩 Helper — persist pending work before OAuth
//   const stashPendingState = (data) => {
//     localStorage.setItem("codezen_pending", JSON.stringify(data));
//   };

//   const popPendingState = () => {
//     const raw = localStorage.getItem("codezen_pending");
//     if (!raw) return null;
//     localStorage.removeItem("codezen_pending");
//     try {
//       return JSON.parse(raw);
//     } catch {
//       return null;
//     }
//   };

//   // 🔹 GitHub login / logout
//   const handleGitHubLogin = () => {
//     stashPendingState({
//       repoUrl,
//       acceptedSuggestions,
//       rejectedSuggestions,
//     });
//     window.location.href = "http://127.0.0.1:8000/login/github";
//   };

//   const handleGitHubLogout = () => {
//     localStorage.removeItem("github_token");
//     setGithubConnected(false);
//     showNotification("GitHub session cleared.", "error");
//   };

//   // 🔹 Capture OAuth Token & restore pending work
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get("token");

//     if (token) {
//       localStorage.setItem("github_token", token);
//       showNotification("GitHub connected successfully!", "success");
//       setGithubConnected(true);

//       const pending = popPendingState();
//       if (pending) {
//         setRepoUrl(pending.repoUrl || "");
//         setAccepted(pending.acceptedSuggestions || []);
//         setRejected(pending.rejectedSuggestions || []);
//         // optionally auto-run Apply again:
//         // handleApplyChanges();
//       }

//       window.history.replaceState({}, document.title, "/");
//     } else if (localStorage.getItem("github_token")) {
//       setGithubConnected(true);
//     }
//   }, []);

//   // --- Stage 1: Fetch + analyze ---
//   const handleRunAnalysis = async () => {
//     if (!repoUrl) {
//       showNotification("Please enter a GitHub repository URL.", "error");
//       return;
//     }
//     setProjectDoc("");
//     setAnalysis([]);
//     setAccepted([]);
//     setRejected([]);
//     setPdfUrl(null);

//     try {
//       setLoading(true);
//       setStatusMessage("🌐 Fetching repository...");
//       const res = await axios.post(`${API_BASE}/run-analysis`, { repo_url: repoUrl });
//       const result = res.data.result;
//       setAnalysis(result.analysis || []);
//       setStatusMessage("🧠 Review AI suggestions below.");
//       showNotification("Analysis complete!", "success");
//     } catch (e) {
//       console.error(e);
//       showNotification("Error running analysis.", "error");
//       setStatusMessage("❌ Failed during analysis.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Suggestion handlers ---
//   const handleAccept = (file, comment = "") => {
//     setAccepted((prev) => [...prev, { file_name: file, comment, accepted: true }]);
//     showNotification(`Accepted for ${file}`, "success");
//   };

//   const handleReject = (file, comment = "") => {
//     setRejected((prev) => [...prev, { file_name: file, comment, accepted: false }]);
//     showNotification(`Rejected for ${file}`, "error");
//   };

//   const handleAcceptAll = () => {
//     const bulk = analysis.flatMap((f) =>
//       (f.refactors || []).map((ref) => ({
//         file_name: f.file,
//         comment: ref,
//         accepted: true,
//       }))
//     );
//     setAccepted(bulk);
//     setRejected([]); // Clear rejected list
//     showNotification("All suggestions marked as accepted.", "success");
//   };

//   const handleRejectAll = () => {
//     const bulk = analysis.flatMap((f) =>
//       (f.refactors || []).map((ref) => ({
//         file_name: f.file,
//         comment: ref,
//         accepted: false,
//       }))
//     );
//     setRejected(bulk);
//     setAccepted([]); // Clear accepted list
//     showNotification("All suggestions marked as rejected.", "error");
//   };

//   // --- Stage 3+4: Apply & Docs ---
//   const handleApplyChanges = async () => {
//     const token = localStorage.getItem("github_token");

//     if (!token) {
//       showNotification("Please sign in with GitHub first!", "error");
//       stashPendingState({ repoUrl, acceptedSuggestions, rejectedSuggestions });
//       handleGitHubLogin();
//       return;
//     }
//     if (acceptedSuggestions.length === 0 && rejectedSuggestions.length === 0) {
//       setStatusMessage("📚 Generating Technical Design Document (TDD)...");
//     } else {
//       setStatusMessage("⚙️ Applying accepted suggestions and committing code...");
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post(`${API_BASE}/apply-changes`, {
//         repo_url: repoUrl,
//         accepted_suggestions: acceptedSuggestions,
//         rejected_suggestions: rejectedSuggestions,
//         doc_format: "md",
//         user_id: "yash_2124",
//         commit_changes: acceptedSuggestions.length > 0,
//         auth_token: token,
//       });

//       const result = res.data.result;
//       setProjectDoc(result.project_doc || "");
//       setShowAnalysis(false); // Hide analysis after apply
//       setStatusMessage("✅ Documentation ready — view TDD below.");
//       showNotification("TDD documentation generated successfully.", "success");
//     } catch (e) {
//       console.error(e);
//       showNotification("Error applying changes or generating docs.", "error");
//       setStatusMessage("❌ Failed during apply/generate.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Export ---
//   const handleExport = async () => {
//     if (!projectDoc) {
//       showNotification("Generate documentation first!", "error");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         `${API_BASE}/export-docs`,
//         {
//           format,
//           docs: [{ file_name: "Project_TDD_Documentation", documentation: projectDoc }],
//         },
//         { responseType: "blob" }
//       );
      
//       const blob = new Blob([res.data], { type: res.headers["content-type"] });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "CodeZen_TDD." + format;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);

//       showNotification(`${format.toUpperCase()} file downloaded!`, "success");
//     } catch (e) {
//       console.error(e);
//       showNotification("Export failed.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <>
//         <Notification {...notification} onClose={() => setNotification({ message: null, type: "info" })} />

//         {/* Center Container */}
//         <div className="min-h-screen flex items-center justify-center bg-zinc-950">
//         {/* Main Card */}
//         <div className="bg-zinc-900/95 backdrop-blur-xl p-10 rounded-2xl shadow-[0_0_25px_4px_rgba(239,68,68,0.3)] border border-red-700 w-full max-w-4xl mx-auto transition-all duration-500 hover:shadow-[0_0_35px_8px_rgba(239,68,68,0.5)]">
      
//         {/* Header */}
//         <h1
//           className="text-5xl font-black text-red-500 mb-1 tracking-widest uppercase flex items-center justify-center font-orbitron"
//           style={neonGlowStyle}
//         >
//         <FileText className="w-10 h-10 mr-2" /> CODEZEN
//         </h1>
//         <p className="text-zinc-100 mb-2 text-center text-xl">
//           Intelligent AI Developer & Documentation Agent
//         </p>
//         {statusMessage && <p className="text-red-300 text-center mb-6">{statusMessage}</p>}

//         {/* GitHub Login Section */}
//         <div className="flex justify-center mb-6">
//           {!githubConnected ? (
//             <button
//               onClick={handleGitHubLogin}
//               className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg flex items-center shadow-lg"
//             >
//               <Github className="w-5 h-5 mr-2" /> Sign in with GitHub
//             </button>
//           ) : (
//             <div className="flex items-center gap-3 text-green-400 font-semibold">
//               <CheckCircle className="w-5 h-5" /> Connected to GitHub
//               <button
//                 onClick={handleGitHubLogout}
//                 className="ml-2 px-3 py-1 text-sm text-red-400 border border-red-500 rounded hover:bg-red-500/10"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Repo Input */}
//         <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
//           <input
//             type="text"
//             placeholder="ENTER GITHUB REPO URL (e.g., https://github.com/mdn/js-examples)"
//             value={repoUrl}
//             onChange={(e) => setRepoUrl(e.target.value)}
//             className="w-full p-4 border-2 border-red-700 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-red-500"
//             disabled={loading}
//           />
//           <button
//             onClick={handleRunAnalysis}
//             className="w-full sm:w-auto px-6 py-3 bg-red-700 text-white font-extrabold uppercase rounded-lg shadow-xl hover:bg-red-600 disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? (
//               <Loader2 className="w-5 h-5 mr-2 inline-block animate-spin" />
//             ) : (
//               <Github className="w-5 h-5 mr-2 inline-block" />
//             )}
//             {loading ? "RUNNING..." : "RUN ANALYSIS"}
//           </button>
//         </div>

//         {/* Per-File Analysis (hidden after Apply) */}
//         {showAnalysis && analysis.length > 0 && (
//           <div className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h2 className="text-2xl text-red-400 font-bold font-orbitron uppercase">
//                 Per-File AI Analysis
//               </h2>
//               <div className="space-x-2">
//                 <button
//                   onClick={handleAcceptAll}
//                   className="px-3 py-2 bg-green-700 hover:bg-green-600 rounded text-white text-sm"
//                 >
//                   Accept All
//                 </button>
//                 <button
//                   onClick={handleRejectAll}
//                   className="px-3 py-2 bg-red-700 hover:bg-red-600 rounded text-white text-sm"
//                 >
//                   Reject All
//                 </button>
//               </div>
//             </div>

//             {analysis.map((file, idx) => (
//               <div key={idx} className="bg-zinc-800 p-5 rounded-lg border border-red-800 shadow-inner">
//                 <h3 className="text-xl text-red-400 font-bold mb-2">{file.file}</h3>
//                 <p className="text-gray-400 mb-3">{file.summary}</p>

//                 <h4 className="text-red-400 font-semibold mb-1">Issues:</h4>
//                 <ul className="list-disc ml-6 text-gray-300">
//                   {(file.issues || []).map((issue, i) => (
//                     <li key={i}>{issue}</li>
//                   ))}
//                 </ul>

//                 <h4 className="text-green-400 font-semibold mt-3 mb-1">Refactor Suggestions:</h4>
//                 <ul className="list-disc ml-6 text-gray-300">
//                   {(file.refactors || []).map((ref, i) => (
//                     <li key={i} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
//                       <span className="flex-1">{ref}</span>
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => handleAccept(file.file, ref)}
//                           className="bg-green-700 hover:bg-green-600 px-2 py-1 rounded text-white text-sm flex items-center"
//                         >
//                           <CheckCircle className="w-4 h-4 mr-1" /> Accept
//                         </button>
//                         <button
//                           onClick={() => handleReject(file.file, ref)}
//                           className="bg-red-700 hover:bg-red-600 px-2 py-1 rounded text-white text-sm flex items-center"
//                         >
//                           <XCircle className="w-4 h-4 mr-1" /> Reject
//                         </button>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}

//             <button
//               onClick={handleApplyChanges}
//               className="px-6 py-3 bg-green-700 hover:bg-green-600 rounded-lg text-white font-bold shadow-lg"
//               disabled={loading}
//             >
//               Apply Selected Suggestions & Generate Docs
//             </button>
//           </div>
//         )}

//         {/* Technical Design Document Section */}
//         {projectDoc && (
//           <div className="mt-10 bg-zinc-800 p-8 rounded-xl border border-red-800 shadow-inner">
//             <h2 className="text-3xl font-bold text-red-400 mb-3 font-orbitron uppercase">
//               Technical Design Document (TDD)
//             </h2>
//             <p className="text-gray-400 mb-4">
//               Generated automatically from your repository structure and analysis.
//             </p>
//             <div className="markdown-body bg-zinc-900 p-4 rounded-lg text-gray-200 overflow-auto max-h-[80vh]">
//               <ReactMarkdown>{projectDoc}</ReactMarkdown>
//             </div>
//           </div>
//         )}

//         {/* Export */}
//         {projectDoc && (
//           <div className="mt-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
//             <select
//               value={format}
//               onChange={(e) => setFormat(e.target.value)}
//               className="w-full sm:w-auto px-4 py-3 border border-red-800 bg-zinc-900 text-zinc-100 font-semibold rounded-lg"
//             >
//               {FORMAT_OPTIONS.map((opt) => (
//                 <option key={opt.key} value={opt.key}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={handleExport}
//               className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-lg"
//               disabled={loading}
//             >
//               <Download className="w-5 h-5 mr-2 inline-block" /> Export {format.toUpperCase()}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Loading Overlay (Completed) */}
//       {loading && (
//         <div className="fixed inset-0 bg-zinc-950 bg-opacity-90 flex items-center justify-center z-40">
//           {/* <div className="bg-zinc-900 p-8 rounded-xl shadow-2xl shadow-red-900/90 border border-red-700 flex flex-col items-center"> */}
//           <div className="bg-zinc-900/95 backdrop-blur-xl p-10 rounded-2xl shadow-[0_0_25px_4px_rgba(239,68,68,0.3)] border border-red-700 w-full max-w-4xl mx-auto transition-all duration-500 hover:shadow-[0_0_35px_8px_rgba(239,68,68,0.5)]">
//             <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
//             <p className="text-xl font-bold text-red-300 uppercase tracking-wider" style={neonGlowStyle}>
//               {statusMessage || "Processing..."}
//             </p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default App;

// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import ReactDiffViewer from "react-diff-viewer-continued";
// import {
//   Github,
//   FileText,
//   Download,
//   Loader2,
//   CheckCircle,
//   XCircle,
//   LogOut,
// } from "lucide-react";

// // --- Configuration Constants ---
// const API_BASE = "http://127.0.0.1:8000";

// const neonGlowStyle = { textShadow: "0 0 4px #f87171, 0 0 10px #ef4444" };

// const FORMAT_OPTIONS = [
//   { key: "pdf", label: "PDF Document" },
//   { key: "docx", label: "Word Document" },
//   { key: "md", label: "Markdown File" },
//   { key: "html", label: "HTML Webpage" },
//   { key: "txt", label: "Plain Text" },
// ];

// // --- Utility Components ---

// /**
//  * Custom Notification Toast Component
//  */
// const Notification = ({ message, type, onClose }) => {
//   if (!message) return null;

//   const baseClasses =
//     "fixed top-4 right-4 p-4 rounded-xl shadow-2xl flex items-center z-50 transition-transform transform duration-300 animate-fade-in-down";

//   let styleClasses;
//   let Icon;

//   switch (type) {
//     case "success":
//       styleClasses = "bg-green-700 text-white";
//       Icon = CheckCircle;
//       break;
//     case "error":
//       styleClasses = "bg-red-700 text-white";
//       Icon = XCircle;
//       break;
//     case "info":
//     default:
//       styleClasses = "bg-blue-700 text-white";
//       Icon = FileText;
//       break;
//   }

//   return (
//     <div className={`${baseClasses} ${styleClasses}`}>
//       <div className="mr-3">
//         <Icon className="w-5 h-5" />
//       </div>
//       {message}
//       <button
//         onClick={onClose}
//         className="ml-4 text-xl font-bold opacity-80 hover:opacity-100"
//         aria-label="Close notification"
//       >
//         &times;
//       </button>
//     </div>
//   );
// };

// // --- Main Application Component ---

// const App = () => {
//   // ----------------------------------------
//   // 1. State Management
//   // ----------------------------------------
//   const [repoUrl, setRepoUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [statusMessage, setStatusMessage] = useState("");
//   const [notification, setNotification] = useState({ message: null, type: "info" });
  
//   // Analysis & Documentation State
//   const [analysis, setAnalysis] = useState([]);
//   const [projectDoc, setProjectDoc] = useState("");
//   const [showAnalysis, setShowAnalysis] = useState(true);

//   // Suggestion State
//   const [acceptedSuggestions, setAccepted] = useState([]);
//   const [rejectedSuggestions, setRejected] = useState([]);

//   // Export State
//   const [format, setFormat] = useState("pdf");
  
//   // Auth State
//   const [githubConnected, setGithubConnected] = useState(false);

//   // 🧠 Simple notification handler (using useCallback for consistency)
//   const showNotification = useCallback((message, type = "info", duration = 2500) => {
//     setNotification({ message, type });
//     const timer = setTimeout(() => setNotification({ message: null, type: "info" }), duration);
//     return () => clearTimeout(timer); // Cleanup function
//   }, []);

//   // ----------------------------------------
//   // 2. Helper Functions (OAuth Stash/Pop)
//   // ----------------------------------------

//   const stashPendingState = (data) => {
//     localStorage.setItem("codezen_pending", JSON.stringify(data));
//   };

//   const popPendingState = () => {
//     const raw = localStorage.getItem("codezen_pending");
//     if (!raw) return null;
//     localStorage.removeItem("codezen_pending");
//     try {
//       return JSON.parse(raw);
//     } catch {
//       return null;
//     }
//   };

//   // ----------------------------------------
//   // 3. GitHub Authentication Handlers
//   // ----------------------------------------

//   const handleGitHubLogin = () => {
//     stashPendingState({
//       repoUrl,
//       acceptedSuggestions,
//       rejectedSuggestions,
//     });
//     window.location.href = `${API_BASE}/login/github`;
//   };

//   const handleGitHubLogout = () => {
//     localStorage.removeItem("github_token");
//     setGithubConnected(false);
//     showNotification("GitHub session cleared.", "error");
//   };

//   // 🔹 Capture OAuth Token & restore pending work
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get("token");

//     if (token) {
//       localStorage.setItem("github_token", token);
//       showNotification("GitHub connected successfully!", "success");
//       setGithubConnected(true);

//       const pending = popPendingState();
//       if (pending) {
//         setRepoUrl(pending.repoUrl || "");
//         setAccepted(pending.acceptedSuggestions || []);
//         setRejected(pending.rejectedSuggestions || []);
//       }

//       window.history.replaceState({}, document.title, "/");
//     } else if (localStorage.getItem("github_token")) {
//       setGithubConnected(true);
//     }
//   }, [showNotification]);


//   // ----------------------------------------
//   // 4. Core Pipeline Handlers
//   // ----------------------------------------

//   // --- Stage 1: Fetch + analyze ---
//   const handleRunAnalysis = async () => {
//     if (!repoUrl) {
//       showNotification("Please enter a GitHub repository URL.", "error");
//       return;
//     }
//     // Reset state for new run
//     setProjectDoc("");
//     setAnalysis([]);
//     setAccepted([]);
//     setRejected([]);
//     setShowAnalysis(true); 

//     try {
//       setLoading(true);
//       setStatusMessage("🌐 Fetching repository and starting AI analysis...");
      
//       const res = await axios.post(`${API_BASE}/run-analysis`, { repo_url: repoUrl });
//       const result = res.data.result;
      
//       setAnalysis(result.analysis || []);
//       setStatusMessage("🧠 Review AI suggestions below.");
//       showNotification("Analysis complete! Review suggestions.", "success");

//     } catch (e) {
//       console.error(e);
//       showNotification("Error running analysis. Check console.", "error");
//       setStatusMessage("❌ Failed during analysis.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Suggestion Handlers ---

//   const handleAccept = (file, comment = "") => {
//     // Ensure uniqueness
//     if (acceptedSuggestions.some(s => s.file_name === file && s.comment === comment)) return; 
//     setAccepted((prev) => [...prev, { file_name: file, comment, accepted: true }]);
//     setRejected((prev) => prev.filter(s => !(s.file_name === file && s.comment === comment)));
//     showNotification(`Accepted refactor for ${file}`, "success");
//   };

//   const handleReject = (file, comment = "") => {
//     // Ensure uniqueness
//     if (rejectedSuggestions.some(s => s.file_name === file && s.comment === comment)) return;
//     setRejected((prev) => [...prev, { file_name: file, comment, accepted: false }]);
//     setAccepted((prev) => prev.filter(s => !(s.file_name === file && s.comment === comment)));
//     showNotification(`Rejected refactor for ${file}`, "error");
//   };

//   const handleAcceptAll = () => {
//     const bulk = analysis.flatMap((f) =>
//       (f.refactors || []).map((ref) => ({
//         file_name: f.file,
//         comment: ref,
//         accepted: true,
//       }))
//     );
//     setAccepted(bulk);
//     setRejected([]);
//     showNotification("All suggestions marked as accepted.", "success");
//   };

//   const handleRejectAll = () => {
//     const bulk = analysis.flatMap((f) =>
//       (f.refactors || []).map((ref) => ({
//         file_name: f.file,
//         comment: ref,
//         accepted: false,
//       }))
//     );
//     setRejected(bulk);
//     setAccepted([]);
//     showNotification("All suggestions marked as rejected.", "error");
//   };

//   // --- Stage 3: Apply Changes Only ---
//   const handleApplyChangesOnly = async () => {
//     const token = localStorage.getItem("github_token");
//     if (!token) {
//       showNotification("Please connect your GitHub first!", "error");
//       stashPendingState({ repoUrl, acceptedSuggestions, rejectedSuggestions });
//       handleGitHubLogin();
//       return;
//     }

//     try {
//       setLoading(true);
//       setStatusMessage("🧩 Applying accepted suggestions and committing changes...");

//       await axios.post(`${API_BASE}/apply-changes`, {
//         repo_url: repoUrl,
//         accepted_suggestions: acceptedSuggestions,
//         rejected_suggestions: rejectedSuggestions,
//         user_id: "yash_2124", // Static user ID for this context
//         commit_changes: true,
//         auth_token: token,
//         doc_format: "md", // not generating docs here, but required by API signature
//       });

//       setStatusMessage("✅ Suggestions applied successfully. Now generate docs!");
//       showNotification("Code changes committed successfully. Now generate documentation.", "success", 4000);

//     } catch (e) {
//       console.error(e);
//       setStatusMessage("❌ Failed to apply changes.");
//       showNotification("Error applying suggestions.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Stage 4: Generate Docs Only ---
//   const handleGenerateDocs = async () => {
//     try {
//       setLoading(true);
//       setStatusMessage("📄 Generating project documentation...");

//       // Assuming a separate API endpoint for just documentation generation
//       const res = await axios.post(`${API_BASE}/generate-docs`, {
//         repo_url: repoUrl,
//         user_id: "yash_2124",
//         doc_format: format,
//       });

//       const result = res.data.result;
//       setProjectDoc(result.project_doc || "");
//       setShowAnalysis(false);
//       setStatusMessage("✅ Documentation generated successfully.");
//       showNotification("Documentation ready!", "success");

//     } catch (e) {
//       console.error(e);
//       setStatusMessage("❌ Failed to generate documentation.");
//       showNotification("Error generating docs.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Export Documentation ---

//   const handleExport = async () => {
//     if (!projectDoc) {
//       showNotification("Generate documentation first!", "error");
//       return;
//     }

//     try {
//       setLoading(true);
//       setStatusMessage(`Preparing ${format.toUpperCase()} file for download...`);

//       const res = await axios.post(
//         `${API_BASE}/export-docs`,
//         {
//           format,
//           docs: [{ file_name: "Project_TDD_Documentation", documentation: projectDoc }],
//         },
//         { responseType: "blob" }
//       );
      
//       // Handle file download from blob response
//       const blob = new Blob([res.data], { type: res.headers["content-type"] });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `CodeZen_TDD.${format}`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);

//       showNotification(`${format.toUpperCase()} file downloaded!`, "success");
//     } catch (e) {
//       console.error(e);
//       showNotification("Export failed.", "error");
//     } finally {
//       setLoading(false);
//       setStatusMessage("");
//     }
//   };

//   // ----------------------------------------
//   // 5. Component Render
//   // ----------------------------------------
//   return (
//     <>
//       {/* Notification Toast */}
//       <Notification
//         {...notification}
//         onClose={() => setNotification({ message: null, type: "info" })}
//       />

//       {/* Main Page Container */}
//       <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 sm:p-8">

//         {/* Main Card (Neon Style) */}
//         <div className="bg-zinc-900/95 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-[0_0_25px_4px_rgba(239,68,68,0.3)] border border-red-700 w-full max-w-4xl mx-auto transition-all duration-500 hover:shadow-[0_0_35px_8px_rgba(239,68,68,0.5)]">

//           {/* Header */}
//           <header className="mb-8 text-center">
//             <h1
//               className="text-4xl sm:text-5xl font-black text-red-500 mb-1 tracking-widest uppercase flex items-center justify-center font-inter"
//               style={neonGlowStyle}
//             >
//               <FileText className="w-8 h-8 sm:w-10 sm:h-10 mr-2" /> CODEZEN
//             </h1>
//             <p className="text-zinc-100 mb-2 text-lg sm:text-xl">
//               Intelligent AI Developer & Documentation Agent
//             </p>
//             {statusMessage && (
//               <p className="text-red-300 text-sm sm:text-base">{statusMessage}</p>
//             )}
//           </header>

//           {/* GitHub Connection Status */}
//           <div className="flex justify-center mb-6">
//             {!githubConnected ? (
//               <button
//                 onClick={handleGitHubLogin}
//                 className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl flex items-center shadow-lg transition duration-300"
//               >
//                 <Github className="w-5 h-5 mr-2" /> Sign in with GitHub
//               </button>
//             ) : (
//               <div className="flex items-center gap-3 text-green-400 font-semibold border border-green-700 p-2 rounded-lg bg-zinc-800">
//                 <CheckCircle className="w-5 h-5" /> GitHub Connected
//                 <button
//                   onClick={handleGitHubLogout}
//                   className="ml-2 px-3 py-1 text-sm text-red-400 border border-red-500 rounded hover:bg-red-500/10 flex items-center"
//                   aria-label="Logout from GitHub"
//                 >
//                   <LogOut className="w-4 h-4 mr-1" /> Logout
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Repo Input & Run Analysis */}
//           <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-8">
//             <input
//               type="text"
//               placeholder="ENTER GITHUB REPO URL (e.g., https://github.com/user/repo)"
//               value={repoUrl}
//               onChange={(e) => setRepoUrl(e.target.value)}
//               className="w-full p-4 border-2 border-red-700 bg-zinc-800 text-zinc-100 rounded-xl focus:ring-red-500 focus:border-red-500 placeholder:text-zinc-500"
//               disabled={loading}
//               aria-label="GitHub Repository URL"
//             />
//             <button
//               onClick={handleRunAnalysis}
//               className="w-full lg:w-auto flex-shrink-0 px-6 py-4 bg-red-700 text-white font-extrabold uppercase rounded-xl shadow-xl hover:bg-red-600 disabled:opacity-50 transition duration-300 flex items-center justify-center"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 mr-2 inline-block animate-spin" />
//                   RUNNING ANALYSIS...
//                 </>
//               ) : (
//                 <>
//                   <Github className="w-5 h-5 mr-2 inline-block" />
//                    RUN AGENT
//                 </>
//               )}
//             </button>
//           </div>

//           {/* Per-File Analysis Section */}
//           {showAnalysis && analysis.length > 0 && (
//             <div className="space-y-6 pt-4 border-t border-red-900">
//               {/* Header */}
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
//                 <h2 className="text-2xl text-red-400 font-bold font-inter uppercase mb-3 sm:mb-0">
//                   **Per-File AI Analysis**
//                 </h2>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={handleAcceptAll}
//                     className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg text-white text-sm font-semibold transition duration-200"
//                   >
//                     Accept All
//                   </button>
//                   <button
//                     onClick={handleRejectAll}
//                     className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-white text-sm font-semibold transition duration-200"
//                   >
//                     Reject All
//                   </button>
//                 </div>
//               </div>

//               {/* Individual File Analysis Cards */}
//               {analysis.map((file, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-zinc-800 p-5 rounded-xl border border-red-800 shadow-inner"
//                 >
//                   <h3 className="text-xl text-red-400 font-bold mb-2">{file.file}</h3>
//                   <p className="text-gray-400 mb-3 text-sm">{file.summary}</p>

//                   {/* Issues */}
//                   <h4 className="text-red-300 font-semibold mb-1 border-t border-zinc-700 pt-3 mt-3">
//                     **Issues Found:**
//                   </h4>
//                   <ul className="list-disc ml-6 text-gray-300 text-sm space-y-1">
//                     {(file.issues || []).map((issue, i) => (
//                       <li key={`issue-${i}`}>{issue}</li>
//                     ))}
//                   </ul>

//                   {/* Refactor Suggestions */}
//                   <h4 className="text-green-400 font-semibold mt-4 mb-2 border-t border-zinc-700 pt-3">
//                     **Refactor Suggestions:**
//                   </h4>
//                   <div className="space-y-3">
//                     {(file.refactors || []).map((ref, i) => {
//                       const isAccepted = acceptedSuggestions.some(
//                         (s) => s.file_name === file.file && s.comment === ref
//                       );
//                       const isRejected = rejectedSuggestions.some(
//                         (s) => s.file_name === file.file && s.comment === ref
//                       );

//                       let statusClass = "bg-zinc-700";
//                       if (isAccepted)
//                         statusClass = "bg-green-800/50 border border-green-600";
//                       if (isRejected)
//                         statusClass = "bg-red-800/50 border border-red-600";

//                       return (
//                         <div
//                           key={`refactor-${i}`}
//                           className={`p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 ${statusClass} transition duration-300`}
//                         >
//                           <span className="flex-1 text-gray-200 text-sm">{ref}</span>
//                           <div className="flex items-center gap-2 flex-shrink-0">
//                             <button
//                               onClick={() => handleAccept(file.file, ref)}
//                               className={`px-3 py-1 rounded text-white text-xs font-semibold flex items-center transition duration-200 ${
//                                 isAccepted
//                                   ? "bg-green-600"
//                                   : "bg-green-700 hover:bg-green-600"
//                               }`}
//                               disabled={isAccepted}
//                             >
//                               <CheckCircle className="w-3 h-3 mr-1" />{" "}
//                               {isAccepted ? "ACCEPTED" : "Accept"}
//                             </button>
//                             <button
//                               onClick={() => handleReject(file.file, ref)}
//                               className={`px-3 py-1 rounded text-white text-xs font-semibold flex items-center transition duration-200 ${
//                                 isRejected
//                                   ? "bg-red-600"
//                                   : "bg-red-700 hover:bg-red-600"
//                               }`}
//                               disabled={isRejected}
//                             >
//                               <XCircle className="w-3 h-3 mr-1" />{" "}
//                               {isRejected ? "REJECTED" : "Reject"}
//                             </button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ))}

//               {/* Apply + Generate Docs Buttons */}
//               <div className="w-full flex flex-col sm:flex-row gap-4 mt-6">
//                 <button
//                   onClick={handleApplyChangesOnly}
//                   className="flex-1 px-6 py-4 bg-yellow-600 hover:bg-yellow-500 rounded-xl text-white font-extrabold uppercase shadow-xl disabled:opacity-50 transition duration-300 flex items-center justify-center"
//                   disabled={loading || acceptedSuggestions.length === 0}
//                 >
//                   <FileText className="w-5 h-5 mr-2" />
//                   **Apply Accepted Suggestions**
//                 </button>

//                 <button
//                   onClick={handleGenerateDocs}
//                   className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-extrabold uppercase shadow-xl disabled:opacity-50 transition duration-300 flex items-center justify-center"
//                   disabled={loading}
//                 >
//                   <FileText className="w-5 h-5 mr-2" />
//                   **Generate Documentation**
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Technical Design Document Section */}
//           {projectDoc && (
//             <div className="mt-10 bg-zinc-800 p-8 rounded-xl border border-red-700 shadow-2xl">
//               <h2 className="text-3xl font-bold text-red-400 mb-3 font-inter uppercase" style={neonGlowStyle}>
//                 **Technical Design Document (TDD)**
//               </h2>
//               <p className="text-gray-400 mb-4 text-sm">
//                 A structured engineering blueprint, automatically generated using the latest repository context.
//               </p>
              
//               {/* Markdown Viewer with Custom Styles */}
//               <div className="bg-zinc-900 p-6 rounded-lg text-gray-200 overflow-auto max-h-[80vh] border border-zinc-700">
//                 <ReactMarkdown
//                   components={{
//                     h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-red-400 mt-4 mb-2 border-b border-red-800 pb-1" {...props} />,
//                     h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold text-red-300 mt-4 mb-2" {...props} />,
//                     h3: ({ node, ...props }) => <h3 className="text-xl font-medium text-red-200 mt-3 mb-1" {...props} />,
//                     p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
//                     code: ({ node, ...props }) => <code className="bg-zinc-800 text-yellow-400 p-1 rounded text-sm" {...props} />,
//                     pre: ({ node, ...props }) => <pre className="bg-zinc-950 p-3 rounded-lg overflow-x-auto text-sm my-3 border border-zinc-700" {...props} />,
//                     ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-4 space-y-1" {...props} />,
//                     ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-4 space-y-1" {...props} />,
//                     hr: ({ node, ...props }) => <hr className="my-6 border-red-800" {...props} />,
//                   }}
//                 >
//                   {projectDoc}
//                 </ReactMarkdown>
//               </div>
//             </div>
//           )}

//           {/* Export Section */}
//           {projectDoc && (
//             <div className="mt-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-zinc-800 rounded-xl border border-red-800">
//               <select
//                 value={format}
//                 onChange={(e) => setFormat(e.target.value)}
//                 className="w-full sm:w-auto px-4 py-3 border border-red-800 bg-zinc-900 text-zinc-100 font-semibold rounded-lg shadow-md focus:ring-red-500 focus:border-red-500"
//                 aria-label="Export Format"
//               >
//                 {FORMAT_OPTIONS.map((opt) => (
//                   <option key={opt.key} value={opt.key}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 onClick={handleExport}
//                 className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold uppercase rounded-lg shadow-lg disabled:opacity-50 transition duration-300 flex items-center justify-center"
//                 disabled={loading}
//               >
//                 <Download className="w-5 h-5 mr-2 inline-block" /> **Export** {format.toUpperCase()}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-zinc-950 bg-opacity-90 flex items-center justify-center z-40">
//           <div className="bg-zinc-900/95 backdrop-blur-xl p-10 rounded-2xl shadow-[0_0_40px_10px_rgba(239,68,68,0.7)] border border-red-500 flex flex-col items-center">
//             <Loader2 className="w-14 h-14 text-red-500 animate-spin mb-6" />
//             <p className="text-xl font-bold text-red-300 uppercase tracking-wider" style={neonGlowStyle}>
//               {statusMessage || "Processing..."}
//             </p>
//             <p className="text-sm text-zinc-400 mt-2">Please wait, this may take a moment...</p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default App;


// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import ReactDiffViewer from "react-diff-viewer-continued";
// import {
//   Github,
//   FileText,
//   Download,
//   Loader2,
//   CheckCircle,
//   XCircle,
//   LogOut,
// } from "lucide-react";

// // --- Configuration Constants ---
// const API_BASE = "http://127.0.0.1:8000";

// const neonGlowStyle = { textShadow: "0 0 4px #f87171, 0 0 10px #ef4444" };

// const FORMAT_OPTIONS = [
//   { key: "pdf", label: "PDF Document" },
//   { key: "docx", label: "Word Document" },
//   { key: "md", label: "Markdown File" },
//   { key: "html", label: "HTML Webpage" },
//   { key: "txt", label: "Plain Text" },
// ];

// // --- Utility Components ---

// /**
//  * Custom Notification Toast Component
//  */
// const Notification = ({ message, type, onClose }) => {
//   if (!message) return null;

//   const baseClasses =
//     "fixed top-4 right-4 p-4 rounded-xl shadow-2xl flex items-center z-50 transition-transform transform duration-300 animate-fade-in-down";

//   let styleClasses;
//   let Icon;

//   switch (type) {
//     case "success":
//       styleClasses = "bg-green-700 text-white";
//       Icon = CheckCircle;
//       break;
//     case "error":
//       styleClasses = "bg-red-700 text-white";
//       Icon = XCircle;
//       break;
//     case "info":
//     default:
//       styleClasses = "bg-blue-700 text-white";
//       Icon = FileText;
//       break;
//   }

//   return (
//     <div className={`${baseClasses} ${styleClasses}`}>
//       <div className="mr-3">
//         <Icon className="w-5 h-5" />
//       </div>
//       {message}
//       <button
//         onClick={onClose}
//         className="ml-4 text-xl font-bold opacity-80 hover:opacity-100"
//         aria-label="Close notification"
//       >
//         &times;
//       </button>
//     </div>
//   );
// };

// // --- Main Application Component ---

// const App = () => {
//   // ----------------------------------------
//   // 1. State Management
//   // ----------------------------------------
//   const [repoUrl, setRepoUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [statusMessage, setStatusMessage] = useState("");
//   const [notification, setNotification] = useState({ message: null, type: "info" });
  
//   // Analysis & Documentation State
//   const [analysis, setAnalysis] = useState([]);
//   const [projectDoc, setProjectDoc] = useState("");
//   const [showAnalysis, setShowAnalysis] = useState(true);

//   // Suggestion State
//   const [acceptedSuggestions, setAccepted] = useState([]);
//   const [rejectedSuggestions, setRejected] = useState([]);

//   // Export State
//   const [format, setFormat] = useState("pdf");
  
//   // Auth State
//   const [githubConnected, setGithubConnected] = useState(false);

//   // 🧠 Simple notification handler (using useCallback for consistency)
//   const showNotification = useCallback((message, type = "info", duration = 2500) => {
//     setNotification({ message, type });
//     const timer = setTimeout(() => setNotification({ message: null, type: "info" }), duration);
//     return () => clearTimeout(timer); // Cleanup function
//   }, []);

//   // ----------------------------------------
//   // 2. Helper Functions (OAuth Stash/Pop)
//   // ----------------------------------------

//   const stashPendingState = (data) => {
//     localStorage.setItem("codezen_pending", JSON.stringify(data));
//   };

//   const popPendingState = () => {
//     const raw = localStorage.getItem("codezen_pending");
//     if (!raw) return null;
//     localStorage.removeItem("codezen_pending");
//     try {
//       return JSON.parse(raw);
//     } catch {
//       return null;
//     }
//   };

//   // ----------------------------------------
//   // 3. GitHub Authentication Handlers
//   // ----------------------------------------

//   const handleGitHubLogin = () => {
//     stashPendingState({
//       repoUrl,
//       acceptedSuggestions,
//       rejectedSuggestions,
//     });
//     window.location.href = `${API_BASE}/login/github`;
//   };

//   const handleGitHubLogout = () => {
//     localStorage.removeItem("github_token");
//     setGithubConnected(false);
//     showNotification("GitHub session cleared.", "error");
//   };

//   // 🔹 Capture OAuth Token & restore pending work
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get("token");

//     if (token) {
//       localStorage.setItem("github_token", token);
//       showNotification("GitHub connected successfully!", "success");
//       setGithubConnected(true);

//       const pending = popPendingState();
//       if (pending) {
//         setRepoUrl(pending.repoUrl || "");
//         setAccepted(pending.acceptedSuggestions || []);
//         setRejected(pending.rejectedSuggestions || []);
//       }

//       window.history.replaceState({}, document.title, "/");
//     } else if (localStorage.getItem("github_token")) {
//       setGithubConnected(true);
//     }
//   }, [showNotification]);


//   // ----------------------------------------
//   // 4. Core Pipeline Handlers
//   // ----------------------------------------

//   // --- Stage 1: Fetch + analyze ---
//   const handleRunAnalysis = async () => {
//     if (!repoUrl) {
//       showNotification("Please enter a GitHub repository URL.", "error");
//       return;
//     }
//     // Reset state for new run
//     setProjectDoc("");
//     setAnalysis([]);
//     setAccepted([]);
//     setRejected([]);
//     setShowAnalysis(true); 

//     try {
//       setLoading(true);
//       setStatusMessage("🌐 Fetching repository and starting AI analysis...");
      
//       const res = await axios.post(`${API_BASE}/run-analysis`, { repo_url: repoUrl });
//       const result = res.data.result;
      
//       setAnalysis(result.analysis || []);
//       setStatusMessage("🧠 Review AI suggestions below.");
//       showNotification("Analysis complete! Review suggestions.", "success");

//     } catch (e) {
//       console.error(e);
//       showNotification("Error running analysis. Check console.", "error");
//       setStatusMessage("❌ Failed during analysis.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Suggestion Handlers ---

//   const handleAccept = (file, comment = "") => {
//     // Ensure uniqueness
//     if (acceptedSuggestions.some(s => s.file_name === file && s.comment === comment)) return; 
//     setAccepted((prev) => [...prev, { file_name: file, comment, accepted: true }]);
//     setRejected((prev) => prev.filter(s => !(s.file_name === file && s.comment === comment)));
//     showNotification(`Accepted refactor for ${file}`, "success");
//   };

//   const handleReject = (file, comment = "") => {
//     // Ensure uniqueness
//     if (rejectedSuggestions.some(s => s.file_name === file && s.comment === comment)) return;
//     setRejected((prev) => [...prev, { file_name: file, comment, accepted: false }]);
//     setAccepted((prev) => prev.filter(s => !(s.file_name === file && s.comment === comment)));
//     showNotification(`Rejected refactor for ${file}`, "error");
//   };

//   const handleAcceptAll = () => {
//     const bulk = analysis.flatMap((f) =>
//       (f.refactors || []).map((ref) => ({
//         file_name: f.file,
//         comment: ref,
//         accepted: true,
//       }))
//     );
//     setAccepted(bulk);
//     setRejected([]);
//     showNotification("All suggestions marked as accepted.", "success");
//   };

//   const handleRejectAll = () => {
//     const bulk = analysis.flatMap((f) =>
//       (f.refactors || []).map((ref) => ({
//         file_name: f.file,
//         comment: ref,
//         accepted: false,
//       }))
//     );
//     setRejected(bulk);
//     setAccepted([]);
//     showNotification("All suggestions marked as rejected.", "error");
//   };

//   // --- Stage 3: Apply Changes Only (UPDATED LOGIC) ---
//   const handleApplyChangesOnly = async () => {
//     const token = localStorage.getItem("github_token");
//     if (!token) {
//       showNotification("Please connect your GitHub first!", "error");
//       stashPendingState({ repoUrl, acceptedSuggestions, rejectedSuggestions });
//       handleGitHubLogin();
//       return;
//     }

//     try {
//       setLoading(true);
//       setStatusMessage("🧩 Applying accepted suggestions and committing changes...");

//       const res = await axios.post(`${API_BASE}/apply-changes`, {
//         repo_url: repoUrl,
//         accepted_suggestions: acceptedSuggestions,
//         rejected_suggestions: rejectedSuggestions,
//         user_id: "yash_2124", // Static user ID for this context
//         commit_changes: true,
//         auth_token: token,
//         doc_format: "md", // not generating docs here, but required by API signature
//       });

//       const result = res.data.result;

//       // ✅ Store diffs if available (Analysis includes files with 'diff')
//       if (result.analysis && Array.isArray(result.analysis) && result.analysis.some(a => a.diff)) {
//         // Filter out items without a 'diff' and use them to update analysis state
//         const diffsWithChanges = result.analysis.filter(a => a.diff);
//         setAnalysis(diffsWithChanges); 
//         setProjectDoc(""); // Clear doc view
//         setShowAnalysis(false); // Switch away from suggestion view
//         setStatusMessage("✅ Code changes applied successfully. Review AI-applied diffs below!");
//         showNotification(`AI applied changes to ${diffsWithChanges.length} file(s).`, "success", 4000);
//       } else {
//         setAnalysis([]); // Clear analysis if no diffs
//         setShowAnalysis(true); // Switch to an empty or doc view area
//         setStatusMessage("✅ Suggestions applied successfully.You can now generate documentation.");
//         showNotification("Changes committed successfully!  Ready to generate docs.", "success", 4000);
//       }
//     } catch (e) {
//       console.error(e);
//       setStatusMessage("❌ Failed to apply changes.");
//       showNotification("Error applying suggestions.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Stage 4: Generate Docs Only ---
//   const handleGenerateDocs = async () => {
//     try {
//       setLoading(true);
//       setStatusMessage("📄 Generating project documentation...");

//       // Assuming a separate API endpoint for just documentation generation
//       const res = await axios.post(`${API_BASE}/generate-docs`, {
//         repo_url: repoUrl,
//         user_id: "yash_2124",
//         doc_format: format,
//       });

//       const result = res.data.result;
//       setProjectDoc(result.project_doc || "");
//       setShowAnalysis(false);
//       setStatusMessage("✅ Documentation generated successfully.");
//       showNotification("Documentation ready!", "success");

//     } catch (e) {
//       console.error(e);
//       setStatusMessage("❌ Failed to generate documentation.");
//       showNotification("Error generating docs.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Export Documentation ---

//   const handleExport = async () => {
//     if (!projectDoc) {
//       showNotification("Generate documentation first!", "error");
//       return;
//     }

//     try {
//       setLoading(true);
//       setStatusMessage(`Preparing ${format.toUpperCase()} file for download...`);

//       const res = await axios.post(
//         `${API_BASE}/export-docs`,
//         {
//           format,
//           docs: [{ file_name: "Project_TDD_Documentation", documentation: projectDoc }],
//         },
//         { responseType: "blob" }
//       );
      
//       // Handle file download from blob response
//       const blob = new Blob([res.data], { type: res.headers["content-type"] });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `CodeZen_TDD.${format}`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);

//       showNotification(`${format.toUpperCase()} file downloaded!`, "success");
//     } catch (e) {
//       console.error(e);
//       showNotification("Export failed.", "error");
//     } finally {
//       setLoading(false);
//       setStatusMessage("");
//     }
//   };

//   // ----------------------------------------
//   // 5. Component Render
//   // ----------------------------------------
//   return (
//     <>
//       {/* Notification Toast */}
//       <Notification
//         {...notification}
//         onClose={() => setNotification({ message: null, type: "info" })}
//       />

//       {/* Main Page Container */}
//       <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 sm:p-8">

//         {/* Main Card (Neon Style) */}
//         <div className="bg-zinc-900/95 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-[0_0_25px_4px_rgba(239,68,68,0.3)] border border-red-700 w-full max-w-4xl mx-auto transition-all duration-500 hover:shadow-[0_0_35px_8px_rgba(239,68,68,0.5)]">

//           {/* Header */}
//           <header className="mb-8 text-center">
//             <h1
//               className="text-4xl sm:text-5xl font-black text-red-500 mb-1 tracking-widest uppercase flex items-center justify-center font-inter"
//               style={neonGlowStyle}
//             >
//               <FileText className="w-8 h-8 sm:w-10 sm:h-10 mr-2" /> CODEZEN
//             </h1>
//             <p className="text-zinc-100 mb-2 text-lg sm:text-xl">
//               Intelligent AI Developer & Documentation Agent
//             </p>
//             {statusMessage && (
//               <p className="text-red-300 text-sm sm:text-base">{statusMessage}</p>
//             )}
//           </header>

//           {/* GitHub Connection Status */}
//           <div className="flex justify-center mb-6">
//             {!githubConnected ? (
//               <button
//                 onClick={handleGitHubLogin}
//                 className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl flex items-center shadow-lg transition duration-300"
//               >
//                 <Github className="w-5 h-5 mr-2" /> Sign in with GitHub
//               </button>
//             ) : (
//               <div className="flex items-center gap-3 text-green-400 font-semibold border border-green-700 p-2 rounded-lg bg-zinc-800">
//                 <CheckCircle className="w-5 h-5" /> GitHub Connected
//                 <button
//                   onClick={handleGitHubLogout}
//                   className="ml-2 px-3 py-1 text-sm text-red-400 border border-red-500 rounded hover:bg-red-500/10 flex items-center"
//                   aria-label="Logout from GitHub"
//                 >
//                   <LogOut className="w-4 h-4 mr-1" /> Logout
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Repo Input & Run Analysis */}
//           <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-8">
//             <input
//               type="text"
//               placeholder="ENTER GITHUB REPO URL (e.g., https://github.com/user/repo)"
//               value={repoUrl}
//               onChange={(e) => setRepoUrl(e.target.value)}
//               className="w-full p-4 border-2 border-red-700 bg-zinc-800 text-zinc-100 rounded-xl focus:ring-red-500 focus:border-red-500 placeholder:text-zinc-500"
//               disabled={loading}
//               aria-label="GitHub Repository URL"
//             />
//             <button
//               onClick={handleRunAnalysis}
//               className="w-full lg:w-auto flex-shrink-0 px-6 py-4 bg-red-700 text-white font-extrabold uppercase rounded-xl shadow-xl hover:bg-red-600 disabled:opacity-50 transition duration-300 flex items-center justify-center"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 mr-2 inline-block animate-spin" />
//                   RUNNING ANALYSIS...
//                 </>
//               ) : (
//                 <>
//                   <Github className="w-5 h-5 mr-2 inline-block" />
//                   RUN AGENT
//                 </>
//               )}
//             </button>
//           </div>

//           {/* ---------------------------------------- */}
//           {/* ANALYSIS / SUGGESTION VIEW (Default) */}
//           {/* ---------------------------------------- */}
//           {showAnalysis && analysis.length > 0 && (
//             <div className="space-y-6 pt-4 border-t border-red-900">
//               {/* Header */}
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
//                 <h2 className="text-2xl text-red-400 font-bold font-inter uppercase mb-3 sm:mb-0">
//                   Per-File AI Analysis
//                 </h2>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={handleAcceptAll}
//                     className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg text-white text-sm font-semibold transition duration-200"
//                   >
//                     Accept All
//                   </button>
//                   <button
//                     onClick={handleRejectAll}
//                     className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-white text-sm font-semibold transition duration-200"
//                   >
//                     Reject All
//                   </button>
//                 </div>
//               </div>

//               {/* Individual File Analysis Cards */}
//               {analysis.map((file, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-zinc-800 p-5 rounded-xl border border-red-800 shadow-inner"
//                 >
//                   <h3 className="text-xl text-red-400 font-bold mb-2">{file.file}</h3>
//                   <p className="text-gray-400 mb-3 text-sm">{file.summary}</p>

//                   {/* Issues */}
//                   <h4 className="text-red-300 font-semibold mb-1 border-t border-zinc-700 pt-3 mt-3">
//                     **Issues Found:**
//                   </h4>
//                   <ul className="list-disc ml-6 text-gray-300 text-sm space-y-1">
//                     {(file.issues || []).map((issue, i) => (
//                       <li key={`issue-${i}`}>{issue}</li>
//                     ))}
//                   </ul>

//                   {/* Refactor Suggestions */}
//                   <h4 className="text-green-400 font-semibold mt-4 mb-2 border-t border-zinc-700 pt-3">
//                     **Refactor Suggestions:**
//                   </h4>
//                   <div className="space-y-3">
//                     {(file.refactors || []).map((ref, i) => {
//                       const isAccepted = acceptedSuggestions.some(
//                         (s) => s.file_name === file.file && s.comment === ref
//                       );
//                       const isRejected = rejectedSuggestions.some(
//                         (s) => s.file_name === file.file && s.comment === ref
//                       );

//                       let statusClass = "bg-zinc-700";
//                       if (isAccepted)
//                         statusClass = "bg-green-800/50 border border-green-600";
//                       if (isRejected)
//                         statusClass = "bg-red-800/50 border border-red-600";

//                       return (
//                         <div
//                           key={`refactor-${i}`}
//                           className={`p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 ${statusClass} transition duration-300`}
//                         >
//                           <span className="flex-1 text-gray-200 text-sm">{ref}</span>
//                           <div className="flex items-center gap-2 flex-shrink-0">
//                             <button
//                               onClick={() => handleAccept(file.file, ref)}
//                               className={`px-3 py-1 rounded text-white text-xs font-semibold flex items-center transition duration-200 ${
//                                 isAccepted
//                                   ? "bg-green-600"
//                                   : "bg-green-700 hover:bg-green-600"
//                               }`}
//                               disabled={isAccepted}
//                             >
//                               <CheckCircle className="w-3 h-3 mr-1" />{" "}
//                               {isAccepted ? "ACCEPTED" : "Accept"}
//                             </button>
//                             <button
//                               onClick={() => handleReject(file.file, ref)}
//                               className={`px-3 py-1 rounded text-white text-xs font-semibold flex items-center transition duration-200 ${
//                                 isRejected
//                                   ? "bg-red-600"
//                                   : "bg-red-700 hover:bg-red-600"
//                               }`}
//                               disabled={isRejected}
//                             >
//                               <XCircle className="w-3 h-3 mr-1" />{" "}
//                               {isRejected ? "REJECTED" : "Reject"}
//                             </button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ))}

//               {/* Apply + Generate Docs Buttons (Only visible in analysis view) */}
//               <div className="w-full flex flex-col sm:flex-row gap-4 mt-6">
//                 <button
//                   onClick={handleApplyChangesOnly}
//                   className="flex-1 px-6 py-4 bg-yellow-600 hover:bg-yellow-500 rounded-xl text-white font-extrabold uppercase shadow-xl disabled:opacity-50 transition duration-300 flex items-center justify-center"
//                   disabled={loading || acceptedSuggestions.length === 0}
//                 >
//                   <FileText className="w-5 h-5 mr-2" />
//                   **Apply Accepted Suggestions**
//                 </button>

//                 <button
//                   onClick={handleGenerateDocs}
//                   className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-extrabold uppercase shadow-xl disabled:opacity-50 transition duration-300 flex items-center justify-center"
//                   disabled={loading}
//                 >
//                   <FileText className="w-5 h-5 mr-2" />
//                   **Generate Documentation**
//                 </button>
//               </div>
//             </div>
//           )}
          
//           {/* ---------------------------------------- */}
//           {/* DIFF VIEWER SECTION (Shown after applying changes) */}
//           {/* ---------------------------------------- */}
//           {!showAnalysis && analysis.length > 0 && analysis.some(a => a.diff) && (
//             <div className="mt-10 bg-zinc-800 p-8 rounded-xl border border-yellow-700 shadow-2xl">
//               <h2 className="text-3xl font-bold text-yellow-400 mb-6 font-inter uppercase">
//                 AI-Applied Code Changes
//               </h2>
//               {analysis.map((file, idx) => file.diff && (
//                 <div key={`diff-${idx}`} className="mb-8">
//                   <h3 className="text-xl text-zinc-100 font-bold mb-3 p-2 bg-zinc-900 rounded-t-lg border-b border-yellow-700">
//                     File: {file.file}
//                   </h3>
//                   <div className="overflow-x-auto">
//                     <ReactDiffViewer 
//                       oldValue={""} 
//                       newValue={file.diff} // <-- FIXED: Use newValue for unified diff string
//                       splitView={false}
//                       leftTitle="Original vs. Updated"
//                       styles={{
//                         contentText: { backgroundColor: '#18181b', color: '#f5f5f5' },
//                         wordDiff: { opacity: 0.8 },
//                         diffContainer: { backgroundColor: '#18181b' },
//                         lineNumber: { color: '#a1a1aa' },
//                         marker: { color: '#a1a1aa' },
//                       }}
//                       // use:"pure-diff" <-- REMOVED: Invalid prop
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* ---------------------------------------- */}
//           {/* TECHNICAL DESIGN DOCUMENT SECTION */}
//           {/* ---------------------------------------- */}
//           {projectDoc && (
//             <div className="mt-10 bg-zinc-800 p-8 rounded-xl border border-red-700 shadow-2xl">
//               <h2 className="text-3xl font-bold text-red-400 mb-3 font-inter uppercase" style={neonGlowStyle}>
//                 Technical Design Document (TDD)
//               </h2>
//               <p className="text-gray-400 mb-4 text-sm">
//                 A structured engineering blueprint, automatically generated using the latest repository context.
//               </p>
              
//               {/* Markdown Viewer with Custom Styles */}
//               <div className="bg-zinc-900 p-6 rounded-lg text-gray-200 overflow-auto max-h-[80vh] border border-zinc-700">
//                 <ReactMarkdown
//                   components={{
//                     h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-red-400 mt-4 mb-2 border-b border-red-800 pb-1" {...props} />,
//                     h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold text-red-300 mt-4 mb-2" {...props} />,
//                     h3: ({ node, ...props }) => <h3 className="text-xl font-medium text-red-200 mt-3 mb-1" {...props} />,
//                     p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
//                     code: ({ node, ...props }) => <code className="bg-zinc-800 text-yellow-400 p-1 rounded text-sm" {...props} />,
//                     pre: ({ node, ...props }) => <pre className="bg-zinc-950 p-3 rounded-lg overflow-x-auto text-sm my-3 border border-zinc-700" {...props} />,
//                     ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-4 space-y-1" {...props} />,
//                     ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-4 space-y-1" {...props} />,
//                     hr: ({ node, ...props }) => <hr className="my-6 border-red-800" {...props} />,
//                   }}
//                 >
//                   {projectDoc}
//                 </ReactMarkdown>
//               </div>
//             </div>
//           )}

//           {/* ---------------------------------------- */}
//           {/* EXPORT SECTION */}
//           {/* ---------------------------------------- */}
//           {projectDoc && (
//             <div className="mt-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-zinc-800 rounded-xl border border-red-800">
//               <select
//                 value={format}
//                 onChange={(e) => setFormat(e.target.value)}
//                 className="w-full sm:w-auto px-4 py-3 border border-red-800 bg-zinc-900 text-zinc-100 font-semibold rounded-lg shadow-md focus:ring-red-500 focus:border-red-500"
//                 aria-label="Export Format"
//               >
//                 {FORMAT_OPTIONS.map((opt) => (
//                   <option key={opt.key} value={opt.key}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 onClick={handleExport}
//                 className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold uppercase rounded-lg shadow-lg disabled:opacity-50 transition duration-300 flex items-center justify-center"
//                 disabled={loading}
//               >
//                 <Download className="w-5 h-5 mr-2 inline-block" /> **Export** {format.toUpperCase()}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-zinc-950 bg-opacity-90 flex items-center justify-center z-40">
//           <div className="bg-zinc-900/95 backdrop-blur-xl p-10 rounded-2xl shadow-[0_0_40px_10px_rgba(239,68,68,0.7)] border border-red-500 flex flex-col items-center">
//             <Loader2 className="w-14 h-14 text-red-500 animate-spin mb-6" />
//             <p className="text-xl font-bold text-red-300 uppercase tracking-wider" style={neonGlowStyle}>
//               {statusMessage || "Processing..."}
//             </p>
//             <p className="text-sm text-zinc-400 mt-2">Please wait, this may take a moment...</p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default App;

// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import ReactDiffViewer from "react-diff-viewer-continued";
// import {
//   Github,
//   FileText,
//   Download,
//   Loader2,
//   CheckCircle,
//   XCircle,
//   LogOut,
// } from "lucide-react";

// // --- Configuration Constants ---
// const API_BASE = "http://127.0.0.1:8000";

// const neonGlowStyle = { textShadow: "0 0 4px #f87171, 0 0 10px #ef4444" };

// const FORMAT_OPTIONS = [
//   { key: "pdf", label: "PDF Document" },
//   { key: "docx", label: "Word Document" },
//   { key: "md", label: "Markdown File" },
//   { key: "html", label: "HTML Webpage" },
//   { key: "txt", label: "Plain Text" },
// ];

// // --- Utility Components ---

// /**
//  * Custom Notification Toast Component
//  */
// const Notification = ({ message, type, onClose }) => {
//   if (!message) return null;

//   const baseClasses =
//     "fixed top-4 right-4 p-4 rounded-xl shadow-2xl flex items-center z-50 transition-transform transform duration-300 animate-fade-in-down";

//   let styleClasses;
//   let Icon;

//   switch (type) {
//     case "success":
//       styleClasses = "bg-green-700 text-white";
//       Icon = CheckCircle;
//       break;
//     case "error":
//       styleClasses = "bg-red-700 text-white";
//       Icon = XCircle;
//       break;
//     case "info":
//     default:
//       styleClasses = "bg-blue-700 text-white";
//       Icon = FileText;
//       break;
//   }

//   return (
//     <div className={`${baseClasses} ${styleClasses}`}>
//       <div className="mr-3">
//         <Icon className="w-5 h-5" />
//       </div>
//       {message}
//       <button
//         onClick={onClose}
//         className="ml-4 text-xl font-bold opacity-80 hover:opacity-100"
//         aria-label="Close notification"
//       >
//         &times;
//       </button>
//     </div>
//   );
// };

// // --- Main Application Component ---

// const App = () => {
//   // ----------------------------------------
//   // 1. State Management
//   // ----------------------------------------
//   const [repoUrl, setRepoUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [statusMessage, setStatusMessage] = useState("");
//   const [notification, setNotification] = useState({ message: null, type: "info" });
  
//   // Analysis & Documentation State
//   const [analysis, setAnalysis] = useState([]);
//   const [projectDoc, setProjectDoc] = useState("");
//   const [showAnalysis, setShowAnalysis] = useState(true);

//   // Suggestion State
//   const [acceptedSuggestions, setAccepted] = useState([]);
//   const [rejectedSuggestions, setRejected] = useState([]);

//   // Export State
//   const [format, setFormat] = useState("pdf");
  
//   // Auth State
//   const [githubConnected, setGithubConnected] = useState(false);

//   // 🧠 Simple notification handler (using useCallback for consistency)
//   const showNotification = useCallback((message, type = "info", duration = 2500) => {
//     setNotification({ message, type });
//     const timer = setTimeout(() => setNotification({ message: null, type: "info" }), duration);
//     return () => clearTimeout(timer); // Cleanup function
//   }, []);

//   // ----------------------------------------
//   // 2. Helper Functions (OAuth Stash/Pop)
//   // ----------------------------------------

//   const stashPendingState = (data) => {
//     localStorage.setItem("codezen_pending", JSON.stringify(data));
//   };

//   const popPendingState = () => {
//     const raw = localStorage.getItem("codezen_pending");
//     if (!raw) return null;
//     localStorage.removeItem("codezen_pending");
//     try {
//       return JSON.parse(raw);
//     } catch {
//       return null;
//     }
//   };

//   // ----------------------------------------
//   // 3. GitHub Authentication Handlers
//   // ----------------------------------------

//   const handleGitHubLogin = () => {
//     stashPendingState({
//       repoUrl,
//       acceptedSuggestions,
//       rejectedSuggestions,
//     });
//     window.location.href = `${API_BASE}/login/github`;
//   };

//   const handleGitHubLogout = () => {
//     localStorage.removeItem("github_token");
//     setGithubConnected(false);
//     showNotification("GitHub session cleared.", "error");
//   };

//   // 🔹 Capture OAuth Token & restore pending work
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get("token");

//     if (token) {
//       localStorage.setItem("github_token", token);
//       showNotification("GitHub connected successfully!", "success");
//       setGithubConnected(true);

//       const pending = popPendingState();
//       if (pending) {
//         setRepoUrl(pending.repoUrl || "");
//         setAccepted(pending.acceptedSuggestions || []);
//         setRejected(pending.rejectedSuggestions || []);
//       }

//       window.history.replaceState({}, document.title, "/");
//     } else if (localStorage.getItem("github_token")) {
//       setGithubConnected(true);
//     }
//   }, [showNotification]);


//   // ----------------------------------------
//   // 4. Core Pipeline Handlers
//   // ----------------------------------------

//   // --- Stage 1: Fetch + analyze ---
//   const handleRunAnalysis = async () => {
//     if (!repoUrl) {
//       showNotification("Please enter a GitHub repository URL.", "error");
//       return;
//     }
//     // Reset state for new run
//     setProjectDoc("");
//     setAnalysis([]);
//     setAccepted([]);
//     setRejected([]);
//     setShowAnalysis(true); 

//     try {
//       setLoading(true);
//       setStatusMessage("🌐 Fetching repository and starting AI analysis...");
      
//       const res = await axios.post(`${API_BASE}/run-analysis`, { repo_url: repoUrl });
//       const result = res.data.result;
      
//       setAnalysis(result.analysis || []);
//       setStatusMessage("🧠 Review AI suggestions below.");
//       showNotification("Analysis complete! Review suggestions.", "success");

//     } catch (e) {
//       console.error(e);
//       showNotification("Error running analysis. Check console.", "error");
//       setStatusMessage("❌ Failed during analysis.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Suggestion Handlers ---

//   const handleAccept = (file, comment = "") => {
//     // Ensure uniqueness
//     if (acceptedSuggestions.some(s => s.file_name === file && s.comment === comment)) return; 
//     setAccepted((prev) => [...prev, { file_name: file, comment, accepted: true }]);
//     setRejected((prev) => prev.filter(s => !(s.file_name === file && s.comment === comment)));
//     showNotification(`Accepted refactor for ${file}`, "success");
//   };

//   const handleReject = (file, comment = "") => {
//     // Ensure uniqueness
//     if (rejectedSuggestions.some(s => s.file_name === file && s.comment === comment)) return;
//     setRejected((prev) => [...prev, { file_name: file, comment, accepted: false }]);
//     setAccepted((prev) => prev.filter(s => !(s.file_name === file && s.comment === comment)));
//     showNotification(`Rejected refactor for ${file}`, "error");
//   };

//   const handleAcceptAll = () => {
//     const bulk = analysis.flatMap((f) =>
//       (f.refactors || []).map((ref) => ({
//         file_name: f.file,
//         comment: ref,
//         accepted: true,
//       }))
//     );
//     setAccepted(bulk);
//     setRejected([]);
//     showNotification("All suggestions marked as accepted.", "success");
//   };

//   const handleRejectAll = () => {
//     const bulk = analysis.flatMap((f) =>
//       (f.refactors || []).map((ref) => ({
//         file_name: f.file,
//         comment: ref,
//         accepted: false,
//       }))
//     );
//     setRejected(bulk);
//     setAccepted([]);
//     showNotification("All suggestions marked as rejected.", "error");
//   };

//   // --- Stage 3: Apply Changes Only (UPDATED LOGIC) ---
//   const handleApplyChangesOnly = async () => {
//     const token = localStorage.getItem("github_token");
//     if (!token) {
//       showNotification("Please connect your GitHub first!", "error");
//       stashPendingState({ repoUrl, acceptedSuggestions, rejectedSuggestions });
//       handleGitHubLogin();
//       return;
//     }

//     try {
//       setLoading(true);
//       setStatusMessage("🧩 Applying accepted suggestions and committing changes...");

//       const res = await axios.post(`${API_BASE}/apply-changes`, {
//         repo_url: repoUrl,
//         accepted_suggestions: acceptedSuggestions,
//         rejected_suggestions: rejectedSuggestions,
//         user_id: "yash_2124", // Static user ID for this context
//         commit_changes: true,
//         auth_token: token,
//         doc_format: "md", // not generating docs here, but required by API signature
//       });

//       const result = res.data.result;

//       // ✅ Store diffs if available (Analysis includes files with 'diff')
//       if (result.analysis && Array.isArray(result.analysis) && result.analysis.some(a => a.diff)) {
//         // Filter out items without a 'diff' and use them to update analysis state
//         const diffsWithChanges = result.analysis.filter(a => a.diff);
//         setAnalysis(diffsWithChanges); 
//         setProjectDoc(""); // Clear doc view
//         setShowAnalysis(false); // Switch away from suggestion view
//         setStatusMessage("✅ Code changes applied successfully. Review AI-applied diffs below!");
//         showNotification(`AI applied changes to ${diffsWithChanges.length} file(s).`, "success", 4000);
//       } else {
//         setAnalysis([]); // Clear analysis if no diffs
//         setShowAnalysis(true); // Switch to an empty or doc view area
//         setStatusMessage("✅ Suggestions applied successfully. No visible diffs to show.");
//         showNotification("Changes committed successfully!", "success", 4000);
//       }
//     } catch (e) {
//       console.error(e);
//       setStatusMessage("❌ Failed to apply changes.");
//       showNotification("Error applying suggestions.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // // --- Stage 4: Generate Docs Only ---
//   // const handleGenerateDocs = async () => {
//   //   try {
//   //     setLoading(true);
//   //     setStatusMessage("📄 Generating project documentation...");

//   //     // Assuming a separate API endpoint for just documentation generation
//   //     const res = await axios.post(`${API_BASE}/generate-docs`, {
//   //       repo_url: repoUrl,
//   //       user_id: "yash_2124",
//   //       doc_format: format,
//   //     });

//   //     const result = res.data.result;
//   //     setProjectDoc(result.project_doc || "");
//   //     setShowAnalysis(false);
//   //     setStatusMessage("✅ Documentation generated successfully.");
//   //     showNotification("Documentation ready!", "success");

//   //   } catch (e) {
//   //     console.error(e);
//   //     setStatusMessage("❌ Failed to generate documentation.");
//   //     showNotification("Error generating docs.", "error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // const handleGenerateDocs = async () => {
//   // try {
//   //   setLoading(true);
//   //   setStatusMessage("📄 Generating live project documentation preview...");

//   //   const res = await axios.post(`${API_BASE}/generate-docs`, {
//   //     repo_url: repoUrl,
//   //     user_id: "yash_2124",
//   //     format: "md",
//   //   });

//   //   const result = res.data?.result || res.data?.data || res.data;
//   //   const doc = result?.project_doc || result?.projectDoc || "";

//   //   console.log("📄 Received doc content preview:", doc.substring(0, 200));

//   //   if (doc.trim()) {
//   //     setProjectDoc(doc);
//   //     setShowAnalysis(false);
//   //     setStatusMessage("✅ Live documentation generated successfully!");
//   //     showNotification("Documentation ready for preview!", "success");
//   //   } else {
//   //     throw new Error("Empty document received.");
//   //   }
//   //   } catch (e) {
//   //     console.error(e);
//   //     setStatusMessage("❌ Failed to generate documentation.");
//   //     showNotification("Error generating documentation.", "error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // const handleGenerateDocs = async () => {
//   // try {
//   //   setLoading(true);
//   //   setStatusMessage("📄 Generating live project documentation preview...");

//   //   const res = await axios.post(`${API_BASE}/generate-docs`, {
//   //     repo_url: repoUrl,
//   //     user_id: "yash_2124",
//   //     format: "md",
//   //   });

//   //   console.log("📄 Full backend response:", res.data);

//   //   const doc =
//   //     res.data?.data?.project_doc ||
//   //     res.data?.result?.project_doc ||
//   //     res.data?.project_doc ||
//   //     "";

//   //   console.log("📘 Extracted Markdown content:", doc.substring(0, 200));

//   //   if (doc && doc.trim() !== "") {
//   //     setProjectDoc(doc);
//   //     setShowAnalysis(false);
//   //     setStatusMessage("✅ Live documentation generated successfully!");
//   //     showNotification("Documentation ready for preview!", "success");
//   //   } else {
//   //     throw new Error("Empty document received from backend.");
//   //   }
//   //   } catch (e) {
//   //     console.error("❌ generate-docs error:", e);
//   //     setStatusMessage("❌ Failed to generate documentation.");
//   //     showNotification("Error generating documentation.", "error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

// // Q-A_Retrieval/easycontext-frontend/src/App.js

//   const handleGenerateDocs = async () => {
//       try {
//           setLoading(true);
//           setStatusMessage("📄 Generating live project documentation preview...");

//           const res = await axios.post(`${API_BASE}/generate-docs`, {
//               repo_url: repoUrl,
//               user_id: "yash_2124",
//               format: "md",
//           });

//           // Add this log to your local console to see the full response structure
//           console.log("📄 Full backend response:", res.data);

//           // This extraction logic is robust enough for the backend's nested format
//           const backend_data = res.data?.data || res.data?.result;
//           const doc = backend_data?.project_doc || ""; 

//           console.log("📘 Extracted Markdown content:", doc.substring(0, 200));

//           if (doc && doc.trim() !== "") {
//               // 🎯 CRITICAL FIXES: Clear conflicting states
//               setAnalysis([]); 
//               setProjectDoc(doc);
//               setShowAnalysis(false); 
            
//               setStatusMessage("✅ Live documentation generated successfully!");
//               showNotification("Documentation ready for preview!", "success");
//           } else {
//               throw new Error("Empty document received from backend.");
//           }
//       } catch (e) {
//           console.error("❌ generate-docs error:", e);
//           setStatusMessage("❌ Failed to generate documentation.");
//           showNotification("Error generating documentation.", "error");
//       } finally {
//           setLoading(false);
//       }
//   };

// // ... (Rest of App component logic remains the same)

//   // ----------------------------------------
//   // 5. Component Render
//   // ----------------------------------------
//   return (
//     <>
//       {/* Notification Toast */}
//       <Notification
//         {...notification}
//         onClose={() => setNotification({ message: null, type: "info" })}
//       />

//       {/* Main Page Container */}
//       <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 sm:p-8">

//         {/* Main Card (Neon Style) */}
//         <div className="bg-zinc-900/95 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-[0_0_25px_4px_rgba(239,68,68,0.3)] border border-red-700 w-full max-w-4xl mx-auto transition-all duration-500 hover:shadow-[0_0_35px_8px_rgba(239,68,68,0.5)]">

//           {/* Header */}
//           <header className="mb-8 text-center">
//             <h1
//               className="text-4xl sm:text-5xl font-black text-red-500 mb-1 tracking-widest uppercase flex items-center justify-center font-inter"
//               style={neonGlowStyle}
//             >
//               <FileText className="w-8 h-8 sm:w-10 sm:h-10 mr-2" /> CODEZEN
//             </h1>
//             <p className="text-zinc-100 mb-2 text-lg sm:text-xl">
//               Intelligent AI Developer & Documentation Agent
//             </p>
//             {statusMessage && (
//               <p className="text-red-300 text-sm sm:text-base">{statusMessage}</p>
//             )}
//           </header>

//           {/* GitHub Connection Status */}
//           <div className="flex justify-center mb-6">
//             {!githubConnected ? (
//               <button
//                 onClick={handleGitHubLogin}
//                 className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl flex items-center shadow-lg transition duration-300"
//               >
//                 <Github className="w-5 h-5 mr-2" /> Sign in with GitHub
//               </button>
//             ) : (
//               <div className="flex items-center gap-3 text-green-400 font-semibold border border-green-700 p-2 rounded-lg bg-zinc-800">
//                 <CheckCircle className="w-5 h-5" /> GitHub Connected
//                 <button
//                   onClick={handleGitHubLogout}
//                   className="ml-2 px-3 py-1 text-sm text-red-400 border border-red-500 rounded hover:bg-red-500/10 flex items-center"
//                   aria-label="Logout from GitHub"
//                 >
//                   <LogOut className="w-4 h-4 mr-1" /> Logout
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Repo Input & Run Analysis */}
//           <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-8">
//             <input
//               type="text"
//               placeholder="ENTER GITHUB REPO URL (e.g., https://github.com/user/repo)"
//               value={repoUrl}
//               onChange={(e) => setRepoUrl(e.target.value)}
//               className="w-full p-4 border-2 border-red-700 bg-zinc-800 text-zinc-100 rounded-xl focus:ring-red-500 focus:border-red-500 placeholder:text-zinc-500"
//               disabled={loading}
//               aria-label="GitHub Repository URL"
//             />
//             <button
//               onClick={handleRunAnalysis}
//               className="w-full lg:w-auto flex-shrink-0 px-6 py-4 bg-red-700 text-white font-extrabold uppercase rounded-xl shadow-xl hover:bg-red-600 disabled:opacity-50 transition duration-300 flex items-center justify-center"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 mr-2 inline-block animate-spin" />
//                   RUNNING ANALYSIS...
//                 </>
//               ) : (
//                 <>
//                   <Github className="w-5 h-5 mr-2 inline-block" />
//                    RUN AGENT
//                 </>
//               )}
//             </button>
//           </div>

//           {/* ---------------------------------------- */}
//           {/* ANALYSIS / SUGGESTION VIEW (Conditional) */}
//           {/* ---------------------------------------- */}
//           {showAnalysis && (
//             <div className="space-y-6 pt-4 border-t border-red-900">
//               {analysis.length > 0 ? (
//                 <>
//                   {/* Header */}
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
//                     <h2 className="text-2xl text-red-400 font-bold font-inter uppercase mb-3 sm:mb-0">
//                       Per-File AI Analysis
//                     </h2>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={handleAcceptAll}
//                         className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg text-white text-sm font-semibold transition duration-200"
//                       >
//                         Accept All
//                       </button>
//                       <button
//                         onClick={handleRejectAll}
//                         className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-white text-sm font-semibold transition duration-200"
//                       >
//                         Reject All
//                       </button>
//                     </div>
//                   </div>

//                   {/* Individual File Analysis Cards */}
//                   {analysis.map((file, idx) => (
//                     <div
//                       key={idx}
//                       className="bg-zinc-800 p-5 rounded-xl border border-red-800 shadow-inner"
//                     >
//                       <h3 className="text-xl text-red-400 font-bold mb-2">{file.file}</h3>
//                       <p className="text-gray-400 mb-3 text-sm">{file.summary}</p>

//                       {/* Issues */}
//                       <h4 className="text-red-300 font-semibold mb-1 border-t border-zinc-700 pt-3 mt-3">
//                         **Issues Found:**
//                       </h4>
//                       <ul className="list-disc ml-6 text-gray-300 text-sm space-y-1">
//                         {(file.issues || []).map((issue, i) => (
//                           <li key={`issue-${i}`}>{issue}</li>
//                         ))}
//                       </ul>

//                       {/* Refactor Suggestions */}
//                       <h4 className="text-green-400 font-semibold mt-4 mb-2 border-t border-zinc-700 pt-3">
//                         **Refactor Suggestions:**
//                       </h4>
//                       <div className="space-y-3">
//                         {(file.refactors || []).map((ref, i) => {
//                           const isAccepted = acceptedSuggestions.some(
//                             (s) => s.file_name === file.file && s.comment === ref
//                           );
//                           const isRejected = rejectedSuggestions.some(
//                             (s) => s.file_name === file.file && s.comment === ref
//                           );

//                           let statusClass = "bg-zinc-700";
//                           if (isAccepted)
//                             statusClass = "bg-green-800/50 border border-green-600";
//                           if (isRejected)
//                             statusClass = "bg-red-800/50 border border-red-600";

//                           return (
//                             <div
//                               key={`refactor-${i}`}
//                               className={`p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 ${statusClass} transition duration-300`}
//                             >
//                               <span className="flex-1 text-gray-200 text-sm">{ref}</span>
//                               <div className="flex items-center gap-2 flex-shrink-0">
//                                 <button
//                                   onClick={() => handleAccept(file.file, ref)}
//                                   className={`px-3 py-1 rounded text-white text-xs font-semibold flex items-center transition duration-200 ${
//                                     isAccepted
//                                       ? "bg-green-600"
//                                       : "bg-green-700 hover:bg-green-600"
//                                   }`}
//                                   disabled={isAccepted}
//                                 >
//                                   <CheckCircle className="w-3 h-3 mr-1" />
//                                   {isAccepted ? "ACCEPTED" : "Accept"}
//                                 </button>
//                                 <button
//                                   onClick={() => handleReject(file.file, ref)}
//                                   className={`px-3 py-1 rounded text-white text-xs font-semibold flex items-center transition duration-200 ${
//                                     isRejected
//                                       ? "bg-red-600"
//                                       : "bg-red-700 hover:bg-red-600"
//                                   }`}
//                                   disabled={isRejected}
//                                 >
//                                   <XCircle className="w-3 h-3 mr-1" />
//                                   {isRejected ? "REJECTED" : "Reject"}
//                                 </button>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   ))}
//                 </>
//               ) : (
//                 <p className="text-center text-gray-400 mt-4">
//                   {/* ✅ Suggestions applied successfully. You can now generate documentation. */}
//                 </p>
//               )}

//               {/* Apply + Generate Docs Buttons (Always visible now inside showAnalysis) */}
//               <div className="w-full flex flex-col sm:flex-row gap-4 mt-6">
//                 <button
//                   onClick={handleApplyChangesOnly}
//                   className="flex-1 px-6 py-4 bg-yellow-600 hover:bg-yellow-500 rounded-xl text-white font-extrabold uppercase shadow-xl disabled:opacity-50 transition duration-300 flex items-center justify-center"
//                   disabled={loading || acceptedSuggestions.length === 0}
//                 >
//                   <FileText className="w-5 h-5 mr-2" />
//                   **Apply Accepted Suggestions**
//                 </button>

//                 <button
//                   onClick={handleGenerateDocs}
//                   className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-extrabold uppercase shadow-xl disabled:opacity-50 transition duration-300 flex items-center justify-center animate-pulse"
//                   disabled={loading}
//                 >
//                   <FileText className="w-5 h-5 mr-2" />
//                   **Generate Documentation**
//                 </button>
//               </div>
//             </div>
//           )}
          
//           {/* ---------------------------------------- */}
//           {/* DIFF VIEWER SECTION (Shown after applying changes) */}
//           {/* ---------------------------------------- */}
//           {!showAnalysis && analysis.length > 0 && analysis.some(a => a.diff) && (
//             <div className="mt-10 bg-zinc-800 p-8 rounded-xl border border-yellow-700 shadow-2xl">
//               <h2 className="text-3xl font-bold text-yellow-400 mb-6 font-inter uppercase">
//                 AI-Applied Code Changes
//               </h2>
//               {analysis.map((file, idx) => file.diff && (
//                 <div key={`diff-${idx}`} className="mb-8">
//                   <h3 className="text-xl text-zinc-100 font-bold mb-3 p-2 bg-zinc-900 rounded-t-lg border-b border-yellow-700">
//                     File: {file.file}
//                   </h3>
//                   <div className="overflow-x-auto">
//                     <ReactDiffViewer 
//                       oldValue={""} 
//                       newValue={file.diff} 
//                       splitView={false}
//                       leftTitle="Original vs. Updated"
//                       styles={{
//                         contentText: { backgroundColor: '#18181b', color: '#f5f5f5' },
//                         wordDiff: { opacity: 0.8 },
//                         diffContainer: { backgroundColor: '#18181b' },
//                         lineNumber: { color: '#a1a1aa' },
//                         marker: { color: '#a1a1aa' },
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           ----------------------------------------
//           /* ---------------------------------------- */
//           /* TECHNICAL DESIGN DOCUMENT SECTION (CSS VISIBILITY FIX) */
//           /* ---------------------------------------- */
//           <div
//             // 🎯 CRITICAL FIX: Always mount, but hide if projectDoc is empty
//             className={`mt-10 bg-zinc-800 p-8 rounded-xl border border-red-700 shadow-2xl transition-all duration-300 ${
//               projectDoc
//                 ? "opacity-100 visible max-h-fit" // Show when doc is present
//                 : "opacity-0 invisible h-0 overflow-hidden" // Hide when doc is empty
//             }`}
//           >
//             <h2 className="text-3xl font-bold text-red-400 mb-3 font-inter uppercase" style={neonGlowStyle}>
//               Technical Design Document (TDD)
//             </h2>
//             <p className="text-gray-400 mb-4 text-sm">
//               A structured engineering blueprint, automatically generated using the latest repository context.
//             </p>
    
//             {/* Debug Log to confirm doc state just before render */}
//             {console.log("🧩 Rendering projectDoc:", projectDoc.slice(0, 100))}

//             {/* Markdown Viewer with Custom Styles */}
//             <div className="bg-zinc-900 p-6 rounded-lg text-gray-200 overflow-auto max-h-[80vh] border border-zinc-700">
//               <ReactMarkdown
//               // 🛑 WARNING: Using 'require()' in a modern React build often fails.
//               // You must import 'remarkGfm' and 'remarkFrontmatter' at the top of the file
//               // and pass the variables here (e.g., remarkPlugins={[remarkGfm]}).
//               // Temporarily removing plugins to eliminate the error source:
//               // remarkPlugins={[require("remark-gfm"), require("remark-frontmatter")]} 

//               components={{
//                   h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-red-400 mt-4 mb-2 border-b border-red-800 pb-1" {...props} />,
//                   h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold text-red-300 mt-4 mb-2" {...props} />,
//                   h3: ({ node, ...props }) => <h3 className="text-xl font-medium text-red-200 mt-3 mb-1" {...props} />,
//                   p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
//                   code: ({ node, ...props }) => <code className="bg-zinc-800 text-yellow-400 p-1 rounded text-sm" {...props} />,
//                   pre: ({ node, ...props }) => <pre className="bg-zinc-950 p-3 rounded-lg overflow-x-auto text-sm my-3 border border-zinc-700" {...props} />,
//                   ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-4 space-y-1" {...props} />,
//                   ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-4 space-y-1" {...props} />,
//                   hr: ({ node, ...props }) => <hr className="my-6 border-red-800" {...props} />,
//               }}
//           >
//               {/* 🛑 Using raw projectDoc to eliminate potential regex issues */}
//               {projectDoc} 
//           </ReactMarkdown>
//       </div>
//   </div>

//           {/* ---------------------------------------- */}
//           {/* EXPORT SECTION */}
//           {/* ---------------------------------------- */}
//           {projectDoc && (
//             <div className="mt-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-zinc-800 rounded-xl border border-red-800">
//               <select
//                 value={format}
//                 onChange={(e) => setFormat(e.target.value)}
//                 className="w-full sm:w-auto px-4 py-3 border border-red-800 bg-zinc-900 text-zinc-100 font-semibold rounded-lg shadow-md focus:ring-red-500 focus:border-red-500"
//                 aria-label="Export Format"
//               >
//                 {FORMAT_OPTIONS.map((opt) => (
//                   <option key={opt.key} value={opt.key}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 onClick={handleExport}
//                 className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold uppercase rounded-lg shadow-lg disabled:opacity-50 transition duration-300 flex items-center justify-center"
//                 disabled={loading}
//               >
//                 <Download className="w-5 h-5 mr-2 inline-block" /> **Export** {format.toUpperCase()}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-zinc-950 bg-opacity-90 flex items-center justify-center z-40">
//           <div className="bg-zinc-900/95 backdrop-blur-xl p-10 rounded-2xl shadow-[0_0_40px_10px_rgba(239,68,68,0.7)] border border-red-500 flex flex-col items-center">
//             <Loader2 className="w-14 h-14 text-red-500 animate-spin mb-6" />
//             <p className="text-xl font-bold text-red-300 uppercase tracking-wider" style={neonGlowStyle}>
//               {statusMessage || "Processing..."}
//             </p>
//             <p className="text-sm text-zinc-400 mt-2">Please wait, this may take a moment...</p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default App;



import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import ReactDiffViewer from "react-diff-viewer-continued";
import {
    Github,
    FileText,
    Download,
    Loader2,
    CheckCircle,
    XCircle,
    LogOut,
} from "lucide-react";

// ✅ ISSUE #1 FIX: Import Markdown Plugins directly
import remarkGfm from "remark-gfm";
// You will need to install these packages: npm install remark-gfm remark-frontmatter
// If remark-frontmatter is not used, you can remove it. Assuming it is needed:
import remarkFrontmatter from "remark-frontmatter"; 

// --- Configuration Constants ---
const API_BASE = "http://127.0.0.1:8000";

const neonGlowStyle = { textShadow: "0 0 4px #f87171, 0 0 10px #ef4444" };

const FORMAT_OPTIONS = [
    { key: "pdf", label: "PDF Document" },
    { key: "docx", label: "Word Document" },
    { key: "md", label: "Markdown File" },
    { key: "html", label: "HTML Webpage" },
    { key: "txt", label: "Plain Text" },
];

// --- Utility Components ---

/**
 * Custom Notification Toast Component
 */
const Notification = ({ message, type, onClose }) => {
    if (!message) return null;

    const baseClasses =
        "fixed top-4 right-4 p-4 rounded-xl shadow-2xl flex items-center z-50 transition-transform transform duration-300 animate-fade-in-down";

    let styleClasses;
    let Icon;

    switch (type) {
        case "success":
            styleClasses = "bg-green-700 text-white";
            Icon = CheckCircle;
            break;
        case "error":
            styleClasses = "bg-red-700 text-white";
            Icon = XCircle;
            break;
        case "info":
        default:
            styleClasses = "bg-blue-700 text-white";
            Icon = FileText;
            break;
    }

    return (
        <div className={`${baseClasses} ${styleClasses}`}>
            <div className="mr-3">
                <Icon className="w-5 h-5" />
            </div>
            {message}
            <button
                onClick={onClose}
                className="ml-4 text-xl font-bold opacity-80 hover:opacity-100"
                aria-label="Close notification"
            >
                &times;
            </button>
        </div>
    );
};

// --- Main Application Component ---

const App = () => {
    // ----------------------------------------
    // 1. State Management
    // ----------------------------------------
    const [repoUrl, setRepoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [notification, setNotification] = useState({ message: null, type: "info" });
    
    // Analysis & Documentation State
    const [analysis, setAnalysis] = useState([]);
    const [projectDoc, setProjectDoc] = useState("");
    const [showAnalysis, setShowAnalysis] = useState(true);

    // Suggestion State
    const [acceptedSuggestions, setAccepted] = useState([]);
    const [rejectedSuggestions, setRejected] = useState([]);

    // Export State
    const [format, setFormat] = useState("pdf");
    
    // Auth State
    const [githubConnected, setGithubConnected] = useState(false);

    // 🧠 Simple notification handler (using useCallback for consistency)
    const showNotification = useCallback((message, type = "info", duration = 2500) => {
        setNotification({ message, type });
        const timer = setTimeout(() => setNotification({ message: null, type: "info" }), duration);
        return () => clearTimeout(timer); // Cleanup function
    }, []);

    // ----------------------------------------
    // 2. Helper Functions (OAuth Stash/Pop)
    // ----------------------------------------

    const stashPendingState = (data) => {
        localStorage.setItem("codezen_pending", JSON.stringify(data));
    };

    const popPendingState = () => {
        const raw = localStorage.getItem("codezen_pending");
        if (!raw) return null;
        localStorage.removeItem("codezen_pending");
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    };

    // ----------------------------------------
    // 3. GitHub Authentication Handlers
    // ----------------------------------------

    const handleGitHubLogin = () => {
        stashPendingState({
            repoUrl,
            acceptedSuggestions,
            rejectedSuggestions,
        });
        window.location.href = `${API_BASE}/login/github`;
    };

    const handleGitHubLogout = () => {
        localStorage.removeItem("github_token");
        setGithubConnected(false);
        showNotification("GitHub session cleared.", "error");
    };

    // 🔹 Capture OAuth Token & restore pending work
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("github_token", token);
            showNotification("GitHub connected successfully!", "success");
            setGithubConnected(true);

            const pending = popPendingState();
            if (pending) {
                setRepoUrl(pending.repoUrl || "");
                setAccepted(pending.acceptedSuggestions || []);
                setRejected(pending.rejectedSuggestions || []);
            }

            window.history.replaceState({}, document.title, "/");
        } else if (localStorage.getItem("github_token")) {
            setGithubConnected(true);
        }
    }, [showNotification]);


    // ----------------------------------------
    // 4. Core Pipeline Handlers
    // ----------------------------------------

    // --- Stage 1: Fetch + analyze ---
    const handleRunAnalysis = async () => {
        if (!repoUrl) {
            showNotification("Please enter a GitHub repository URL.", "error");
            return;
        }
        // Reset state for new run
        setProjectDoc("");
        setAnalysis([]);
        setAccepted([]);
        setRejected([]);
        setShowAnalysis(true); 

        try {
            setLoading(true);
            setStatusMessage("🌐 Fetching repository and starting AI analysis...");
            
            const res = await axios.post(`${API_BASE}/run-analysis`, { repo_url: repoUrl });
            const result = res.data.result;
            
            setAnalysis(result.analysis || []);
            setStatusMessage("🧠 Review AI suggestions below.");
            showNotification("Analysis complete! Review suggestions.", "success");

        } catch (e) {
            console.error(e);
            showNotification("Error running analysis. Check console.", "error");
            setStatusMessage("❌ Failed during analysis.");
        } finally {
            setLoading(false);
        }
    };

    // --- Suggestion Handlers ---

    const handleAccept = (file, comment = "") => {
        // Ensure uniqueness
        if (acceptedSuggestions.some(s => s.file_name === file && s.comment === comment)) return; 
        setAccepted((prev) => [...prev, { file_name: file, comment, accepted: true }]);
        setRejected((prev) => prev.filter(s => !(s.file_name === file && s.comment === comment)));
        showNotification(`Accepted refactor for ${file}`, "success");
    };

    const handleReject = (file, comment = "") => {
        // Ensure uniqueness
        if (rejectedSuggestions.some(s => s.file_name === file && s.comment === comment)) return;
        setRejected((prev) => [...prev, { file_name: file, comment, accepted: false }]);
        setAccepted((prev) => prev.filter(s => !(s.file_name === file && s.comment === comment)));
        showNotification(`Rejected refactor for ${file}`, "error");
    };

    const handleAcceptAll = () => {
        const bulk = analysis.flatMap((f) =>
            (f.refactors || []).map((ref) => ({
                file_name: f.file,
                comment: ref,
                accepted: true,
            }))
        );
        setAccepted(bulk);
        setRejected([]);
        showNotification("All suggestions marked as accepted.", "success");
    };

    const handleRejectAll = () => {
        const bulk = analysis.flatMap((f) =>
            (f.refactors || []).map((ref) => ({
                file_name: f.file,
                comment: ref,
                accepted: false,
            }))
        );
        setRejected(bulk);
        setAccepted([]);
        showNotification("All suggestions marked as rejected.", "error");
    };

    // --- Stage 3: Apply Changes Only (UPDATED LOGIC) ---
    const handleApplyChangesOnly = async () => {
        const token = localStorage.getItem("github_token");
        if (!token) {
            showNotification("Please connect your GitHub first!", "error");
            stashPendingState({ repoUrl, acceptedSuggestions, rejectedSuggestions });
            handleGitHubLogin();
            return;
        }

        try {
            setLoading(true);
            setStatusMessage("🧩 Applying accepted suggestions and committing changes...");

            const res = await axios.post(`${API_BASE}/apply-changes`, {
                repo_url: repoUrl,
                accepted_suggestions: acceptedSuggestions,
                rejected_suggestions: rejectedSuggestions,
                user_id: "yash_2124", // Static user ID for this context
                commit_changes: true,
                auth_token: token,
                doc_format: "md", // not generating docs here, but required by API signature
            });

            const result = res.data.result;

            // ✅ Store diffs if available (Analysis includes files with 'diff')
            if (result.analysis && Array.isArray(result.analysis) && result.analysis.some(a => a.diff)) {
                // Filter out items without a 'diff' and use them to update analysis state
                const diffsWithChanges = result.analysis.filter(a => a.diff);
                setAnalysis(diffsWithChanges); 
                setProjectDoc(""); // Clear doc view
                setShowAnalysis(false); // Switch away from suggestion view
                setStatusMessage("✅ Code changes applied successfully. Review AI-applied diffs below!");
                showNotification(`AI applied changes to ${diffsWithChanges.length} file(s).`, "success", 4000);
            } else {
                setAnalysis([]); // Clear analysis if no diffs
                setShowAnalysis(true); // Switch to an empty or doc view area
                setStatusMessage("✅ Suggestions applied successfully. No visible diffs to show.");
                showNotification("Changes committed successfully!", "success", 4000);
            }
        } catch (e) {
            console.error(e);
            setStatusMessage("❌ Failed to apply changes.");
            showNotification("Error applying suggestions.", "error");
        } finally {
            setLoading(false);
        }
    };

    // --- Stage 4: Generate Docs Only ---
    const handleGenerateDocs = async () => {
        try {
            setLoading(true);
            setStatusMessage("📄 Generating live project documentation preview...");

            const res = await axios.post(`${API_BASE}/generate-docs`, {
                repo_url: repoUrl,
                user_id: "yash_2124",
                format: "md",
            });

            // Add this log to your local console to see the full response structure
            console.log("📄 Full backend response:", res.data);

            // This extraction logic is robust enough for the backend's nested format
            const backend_data = res.data?.data || res.data?.result;
            const doc = backend_data?.project_doc || ""; 

            console.log("📘 Extracted Markdown content:", doc.substring(0, 200));

            if (doc && doc.trim() !== "") {
                // 🎯 CRITICAL FIXES: Clear conflicting states
                setAnalysis([]); 
                setProjectDoc(doc);
                setShowAnalysis(false); 
                
                setStatusMessage("✅ Live documentation generated successfully!");
                showNotification("Documentation ready for preview!", "success");
            } else {
                throw new Error("Empty document received from backend.");
            }
        } catch (e) {
            console.error("❌ generate-docs error:", e);
            setStatusMessage("❌ Failed to generate documentation.");
            showNotification("Error generating documentation.", "error");
        } finally {
            setLoading(false);
        }
    };
    
    // ✅ ISSUE #2 FIX: Placeholder for handleExport
    // --- Stage 5: Export Documentation ---
    const handleExport = async () => {
      if (!projectDoc) {
        showNotification("Generate documentation first!", "error");
        return;
      }

      try {
      setLoading(true);
      setStatusMessage(`Preparing ${format.toUpperCase()} file for download...`);

      // 🔹 Send the documentation + selected format to the backend
      const res = await axios.post(
      ` ${API_BASE}/export-docs`,
        {
          format,
          docs: [{ file_name: "Project_TDD_Documentation", documentation: projectDoc }],
        },
        { responseType: "blob" } // important for file downloads
      );

      // 🔹 Create a blob and download link
      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CodeZen_TDD.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showNotification(`${format.toUpperCase()} file downloaded!`, "success");
      setStatusMessage("");
    } catch (e) {
      console.error("❌ Export failed:", e);
      showNotification("Export failed. Check console.", "error");
      setStatusMessage("❌ Export failed.");
    } finally {
      setLoading(false);
    }
  };



    // ----------------------------------------
    // 5. Component Render
    // ----------------------------------------
    return (
        <>
            {/* Notification Toast */}
            <Notification
                {...notification}
                onClose={() => setNotification({ message: null, type: "info" })}
            />

            {/* Main Page Container */}
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 sm:p-8">

                {/* Main Card (Neon Style) */}
                <div className="bg-zinc-900/95 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-[0_0_25px_4px_rgba(239,68,68,0.3)] border border-red-700 w-full max-w-4xl mx-auto transition-all duration-500 hover:shadow-[0_0_35px_8px_rgba(239,68,68,0.5)]">

                    {/* Header */}
                    <header className="mb-8 text-center">
                        <h1
                            className="text-4xl sm:text-5xl font-black text-red-500 mb-1 tracking-widest uppercase flex items-center justify-center font-inter"
                            style={neonGlowStyle}
                        >
                            <FileText className="w-8 h-8 sm:w-10 sm:h-10 mr-2" /> CODEZEN
                        </h1>
                        <p className="text-zinc-100 mb-2 text-lg sm:text-xl">
                            Intelligent AI Developer & Documentation Agent
                        </p>
                        {statusMessage && (
                            <p className="text-red-300 text-sm sm:text-base">{statusMessage}</p>
                        )}
                    </header>

                    {/* GitHub Connection Status */}
                    <div className="flex justify-center mb-6">
                        {!githubConnected ? (
                            <button
                                onClick={handleGitHubLogin}
                                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl flex items-center shadow-lg transition duration-300"
                            >
                                <Github className="w-5 h-5 mr-2" /> Sign in with GitHub
                            </button>
                        ) : (
                            <div className="flex items-center gap-3 text-green-400 font-semibold border border-green-700 p-2 rounded-lg bg-zinc-800">
                                <CheckCircle className="w-5 h-5" /> GitHub Connected
                                <button
                                    onClick={handleGitHubLogout}
                                    className="ml-2 px-3 py-1 text-sm text-red-400 border border-red-500 rounded hover:bg-red-500/10 flex items-center"
                                    aria-label="Logout from GitHub"
                                >
                                    <LogOut className="w-4 h-4 mr-1" /> Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Repo Input & Run Analysis */}
                    <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-8">
                        <input
                            type="text"
                            placeholder="ENTER GITHUB REPO URL (e.g., https://github.com/user/repo)"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            className="w-full p-4 border-2 border-red-700 bg-zinc-800 text-zinc-100 rounded-xl focus:ring-red-500 focus:border-red-500 placeholder:text-zinc-500"
                            disabled={loading}
                            aria-label="GitHub Repository URL"
                        />
                        <button
                            onClick={handleRunAnalysis}
                            className="w-full lg:w-auto flex-shrink-0 px-6 py-4 bg-red-700 text-white font-extrabold uppercase rounded-xl shadow-xl hover:bg-red-600 disabled:opacity-50 transition duration-300 flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 inline-block animate-spin" />
                                    RUNNING ANALYSIS...
                                </>
                            ) : (
                                <>
                                    <Github className="w-5 h-5 mr-2 inline-block" />
                                    RUN AGENT
                                </>
                            )}
                        </button>
                    </div>

                    {/* ---------------------------------------- */}
                    {/* ANALYSIS / SUGGESTION VIEW (Conditional) */}
                    {/* ---------------------------------------- */}
                    {showAnalysis && (
                        <div className="space-y-6 pt-4 border-t border-red-900">
                            {analysis.length > 0 ? (
                                <>
                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                        <h2 className="text-2xl text-red-400 font-bold font-inter uppercase mb-3 sm:mb-0">
                                            Per-File AI Analysis
                                        </h2>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handleAcceptAll}
                                                className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg text-white text-sm font-semibold transition duration-200"
                                            >
                                                Accept All
                                            </button>
                                            <button
                                                onClick={handleRejectAll}
                                                className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-white text-sm font-semibold transition duration-200"
                                            >
                                                Reject All
                                            </button>
                                        </div>
                                    </div>

                                    {/* Individual File Analysis Cards */}
                                    {analysis.map((file, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-zinc-800 p-5 rounded-xl border border-red-800 shadow-inner"
                                        >
                                            <h3 className="text-xl text-red-400 font-bold mb-2">{file.file}</h3>
                                            <p className="text-gray-400 mb-3 text-sm">{file.summary}</p>

                                            {/* Issues */}
                                            <h4 className="text-red-300 font-semibold mb-1 border-t border-zinc-700 pt-3 mt-3">
                                                **Issues Found:**
                                            </h4>
                                            <ul className="list-disc ml-6 text-gray-300 text-sm space-y-1">
                                                {(file.issues || []).map((issue, i) => (
                                                    <li key={`issue-${i}`}>{issue}</li>
                                                ))}
                                            </ul>

                                            {/* Refactor Suggestions */}
                                            <h4 className="text-green-400 font-semibold mt-4 mb-2 border-t border-zinc-700 pt-3">
                                                **Refactor Suggestions:**
                                            </h4>
                                            <div className="space-y-3">
                                                {(file.refactors || []).map((ref, i) => {
                                                    const isAccepted = acceptedSuggestions.some(
                                                        (s) => s.file_name === file.file && s.comment === ref
                                                    );
                                                    const isRejected = rejectedSuggestions.some(
                                                        (s) => s.file_name === file.file && s.comment === ref
                                                    );

                                                    let statusClass = "bg-zinc-700";
                                                    if (isAccepted)
                                                        statusClass = "bg-green-800/50 border border-green-600";
                                                    if (isRejected)
                                                        statusClass = "bg-red-800/50 border border-red-600";

                                                    return (
                                                        <div
                                                            key={`refactor-${i}`}
                                                            className={`p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 ${statusClass} transition duration-300`}
                                                        >
                                                            <span className="flex-1 text-gray-200 text-sm">{ref}</span>
                                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                                <button
                                                                    onClick={() => handleAccept(file.file, ref)}
                                                                    className={`px-3 py-1 rounded text-white text-xs font-semibold flex items-center transition duration-200 ${
                                                                        isAccepted
                                                                            ? "bg-green-600"
                                                                            : "bg-green-700 hover:bg-green-600"
                                                                    }`}
                                                                    disabled={isAccepted}
                                                                >
                                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                                    {isAccepted ? "ACCEPTED" : "Accept"}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(file.file, ref)}
                                                                    className={`px-3 py-1 rounded text-white text-xs font-semibold flex items-center transition duration-200 ${
                                                                        isRejected
                                                                            ? "bg-red-600"
                                                                            : "bg-red-700 hover:bg-red-600"
                                                                    }`}
                                                                    disabled={isRejected}
                                                                >
                                                                    <XCircle className="w-3 h-3 mr-1" />
                                                                    {isRejected ? "REJECTED" : "Reject"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <p className="text-center text-gray-400 mt-4">
                                    {/* This is empty when analysis is cleared, which is fine. */}
                                </p>
                            )}

                            {/* Apply + Generate Docs Buttons (Always visible now inside showAnalysis) */}
                            <div className="w-full flex flex-col sm:flex-row gap-4 mt-6">
                                <button
                                    onClick={handleApplyChangesOnly}
                                    className="flex-1 px-6 py-4 bg-yellow-600 hover:bg-yellow-500 rounded-xl text-white font-extrabold uppercase shadow-xl disabled:opacity-50 transition duration-300 flex items-center justify-center"
                                    disabled={loading || acceptedSuggestions.length === 0}
                                >
                                    <FileText className="w-5 h-5 mr-2" />
                                    **Apply Accepted Suggestions**
                                </button>

                                <button
                                    onClick={handleGenerateDocs}
                                    className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-extrabold uppercase shadow-xl disabled:opacity-50 transition duration-300 flex items-center justify-center animate-pulse"
                                    disabled={loading}
                                >
                                    <FileText className="w-5 h-5 mr-2" />
                                    **Generate Documentation**
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* ---------------------------------------- */}
                    {/* DIFF VIEWER SECTION (Shown after applying changes) */}
                    {/* ---------------------------------------- */}
                    {!showAnalysis && analysis.length > 0 && analysis.some(a => a.diff) && (
                        <div className="mt-10 bg-zinc-800 p-8 rounded-xl border border-yellow-700 shadow-2xl">
                            <h2 className="text-3xl font-bold text-yellow-400 mb-6 font-inter uppercase">
                                AI-Applied Code Changes
                            </h2>
                            {analysis.map((file, idx) => file.diff && (
                                <div key={`diff-${idx}`} className="mb-8">
                                    <h3 className="text-xl text-zinc-100 font-bold mb-3 p-2 bg-zinc-900 rounded-t-lg border-b border-yellow-700">
                                        File: {file.file}
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <ReactDiffViewer 
                                            oldValue={""} 
                                            newValue={file.diff} 
                                            splitView={false}
                                            leftTitle="Original vs. Updated"
                                            styles={{
                                                contentText: { backgroundColor: '#18181b', color: '#f5f5f5' },
                                                wordDiff: { opacity: 0.8 },
                                                diffContainer: { backgroundColor: '#18181b' },
                                                lineNumber: { color: '#a1a1aa' },
                                                marker: { color: '#a1a1aa' },
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ---------------------------------------- */}
                    {/* TECHNICAL DESIGN DOCUMENT SECTION (CSS VISIBILITY FIX) */}
                    {/* ---------------------------------------- */}
                    <div
                        // 🎯 CRITICAL FIX: Always mount, but hide/show with CSS
                        className={`mt-10 bg-zinc-800 p-8 rounded-xl border border-red-700 shadow-2xl transition-all duration-300 ${
                            projectDoc
                                ? "opacity-100 visible max-h-fit" // Show when doc is present
                                : "opacity-0 invisible h-0 overflow-hidden" // Hide when doc is empty
                        }`}
                    >
                        <h2 className="text-3xl font-bold text-red-400 mb-3 font-inter uppercase" style={neonGlowStyle}>
                            Technical Design Document (TDD)
                        </h2>
                        <p className="text-gray-400 mb-4 text-sm">
                            A structured engineering blueprint, automatically generated using the latest repository context.
                        </p>
                    
                        {/* Debug Log to confirm doc state just before render */}
                        {console.log("🧩 Rendering projectDoc:", projectDoc.slice(0, 100))}

                        {/* Markdown Viewer with Custom Styles */}
                        <div className="bg-zinc-900 p-6 rounded-lg text-gray-200 overflow-auto max-h-[80vh] border border-zinc-700">
                            <ReactMarkdown
                                // ✅ ISSUE #1 FIX: Pass imported variables instead of 'require()'
                                remarkPlugins={[remarkGfm, remarkFrontmatter]} 
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-red-400 mt-4 mb-2 border-b border-red-800 pb-1" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold text-red-300 mt-4 mb-2" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-xl font-medium text-red-200 mt-3 mb-1" {...props} />,
                                    p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                                    code: ({ node, ...props }) => <code className="bg-zinc-800 text-yellow-400 p-1 rounded text-sm" {...props} />,
                                    pre: ({ node, ...props }) => <pre className="bg-zinc-950 p-3 rounded-lg overflow-x-auto text-sm my-3 border border-zinc-700" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-4 space-y-1" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-4 space-y-1" {...props} />,
                                    hr: ({ node, ...props }) => <hr className="my-6 border-red-800" {...props} />,
                                }}
                            >
                                {/* 🛑 Rendering raw projectDoc, as the regex was removed */}
                                {projectDoc} 
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* ---------------------------------------- */}
                    {/* EXPORT SECTION */}
                    {/* ---------------------------------------- */}
                    {projectDoc && (
                        <div className="mt-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-zinc-800 rounded-xl border border-red-800">
                            <select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                className="w-full sm:w-auto px-4 py-3 border border-red-800 bg-zinc-900 text-zinc-100 font-semibold rounded-lg shadow-md focus:ring-red-500 focus:border-red-500"
                                aria-label="Export Format"
                            >
                                {FORMAT_OPTIONS.map((opt) => (
                                    <option key={opt.key} value={opt.key}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleExport}
                                className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold uppercase rounded-lg shadow-lg disabled:opacity-50 transition duration-300 flex items-center justify-center"
                                disabled={loading}
                            >
                                <Download className="w-5 h-5 mr-2 inline-block" /> **Export** {format.toUpperCase()}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-zinc-950 bg-opacity-90 flex items-center justify-center z-40">
                    <div className="bg-zinc-900/95 backdrop-blur-xl p-10 rounded-2xl shadow-[0_0_40px_10px_rgba(239,68,68,0.7)] border border-red-500 flex flex-col items-center">
                        <Loader2 className="w-14 h-14 text-red-500 animate-spin mb-6" />
                        <p className="text-xl font-bold text-red-300 uppercase tracking-wider" style={neonGlowStyle}>
                            {statusMessage || "Processing..."}
                        </p>
                        <p className="text-sm text-zinc-400 mt-2">Please wait, this may take a moment...</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default App;