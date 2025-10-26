import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import Loader from './components/Loader';
import InvoiceTable from './components/InvoiceTable';
import { analyzeInvoice } from './services/geminiService';
import type { InvoiceData } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setImageFile(null);
    setImageUrl(null);
    setInvoiceData(null);
    setError(null);
    setIsLoading(false);
    setIsPdf(false);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove the `data:image/...;base64,` part
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = useCallback(async (file: File) => {
    resetState();
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setIsLoading(true);

    if (file.type === 'application/pdf') {
        setIsPdf(true);
    }

    try {
      const base64Image = await fileToBase64(file);
      const data = await analyzeInvoice(base64Image, file.type);
      setInvoiceData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAccountChange = (itemIndex: number, newAccountNumber: string) => {
    if (!invoiceData) return;

    const updatedLineItems = [...invoiceData.lineItems];
    updatedLineItems[itemIndex].suggestedAccountNumber = newAccountNumber;
    
    setInvoiceData({
      ...invoiceData,
      lineItems: updatedLineItems,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            {!invoiceData && (
                <>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload Invoice</h2>
                <FileUpload onFileSelect={handleFileSelect} disabled={isLoading} />
                </>
            )}

            {imageUrl && !invoiceData && !isLoading && !error && (
              <div className="mt-6 text-center text-gray-500">
                <p>Ready to analyze. Waiting for a moment...</p>
              </div>
            )}
            
            {imageUrl && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{isPdf ? 'PDF Preview' : 'Image Preview'}</h3>
                { isPdf ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2 font-semibold text-gray-700">{imageFile?.name}</p>
                        <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-sm text-blue-600 hover:underline">
                            Open PDF in new tab
                        </a>
                    </div>
                ) : (
                    <img src={imageUrl} alt="Invoice preview" className="rounded-lg shadow-md max-w-full h-auto mx-auto" />
                )}
              </div>
            )}
          </div>

          <div className="max-w-7xl mx-auto mt-8">
            {isLoading && <Loader message="Analyzing your invoice..." />}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-3xl mx-auto" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <button 
                  onClick={resetState} 
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                >
                  <span className="text-2xl" aria-hidden="true">&times;</span>
                </button>
              </div>
            )}

            {invoiceData && !isLoading && (
              <div>
                <div className="flex justify-end mb-4">
                    <button 
                        onClick={resetState}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg inline-flex items-center transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
                        </svg>
                        Scan New Invoice
                    </button>
                </div>
                <InvoiceTable invoiceData={invoiceData} onAccountChange={handleAccountChange} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;