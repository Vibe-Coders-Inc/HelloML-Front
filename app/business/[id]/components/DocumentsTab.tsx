'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download, Trash2, File, AlertCircle, Loader2 } from 'lucide-react';
import { useDocuments, useUploadPDFDocument, useUploadTextDocument, useDeleteDocument } from '@/lib/hooks/use-documents';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { documentKeys } from '@/lib/hooks/use-documents';

interface DocumentsTabProps {
  agentId?: number;
}

export default function DocumentsTab({ agentId }: DocumentsTabProps) {
  const queryClient = useQueryClient();
  const { data: documents = [], isLoading } = useDocuments(agentId || 0);
  const uploadPDFMutation = useUploadPDFDocument();
  const uploadTextMutation = useUploadTextDocument();
  const deleteDocumentMutation = useDeleteDocument();

  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadStartTime = useRef<number>(0);

  // File size limits (match backend)
  const MAX_PDF_SIZE = 5 * 1024 * 1024;  // 5MB
  const MAX_TEXT_SIZE = 1 * 1024 * 1024; // 1MB

  // Minimum thresholds
  const MIN_FILE_SIZE = 100; // 100 bytes minimum
  const MIN_TEXT_LENGTH = 50; // 50 characters minimum
  const MIN_OVERLAY_DURATION = 2000; // Show overlay for at least 2 seconds

  // Start upload - show overlay immediately
  const startUpload = (fileName: string) => {
    console.log('[DocumentsTab] Starting upload overlay for:', fileName);
    setUploadingFileName(fileName);
    setIsUploading(true);
    uploadStartTime.current = Date.now();
  };

  // End upload - hide overlay after minimum duration
  const endUpload = () => {
    const elapsed = Date.now() - uploadStartTime.current;
    const remaining = Math.max(0, MIN_OVERLAY_DURATION - elapsed);
    console.log('[DocumentsTab] Ending upload, waiting:', remaining, 'ms');
    setTimeout(() => {
      setIsUploading(false);
      setUploadingFileName(null);
    }, remaining);
  };

  // Poll for processing documents
  useEffect(() => {
    const hasProcessing = documents.some(doc => doc.status === 'processing');
    if (hasProcessing && agentId) {
      const interval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: documentKeys.list(agentId) });
      }, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [documents, agentId, queryClient]);

  const handleFileUpload = async (files: FileList) => {
    if (!agentId) {
      toast.error('No agent selected');
      console.error('[DocumentsTab] Upload failed: No agent ID');
      return;
    }

    // Clear any previous errors
    setUploadError(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      console.log('[DocumentsTab] Processing file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        extension: fileExtension,
      });

      // Validate file type
      if (fileExtension !== 'txt' && fileExtension !== 'pdf') {
        const errorMsg = `Invalid file type: ${file.name}. Only PDF and TXT files are supported.`;
        setUploadError(errorMsg);
        toast.error(errorMsg);
        console.error('[DocumentsTab]', errorMsg);
        continue;
      }

      // Validate minimum file size
      if (file.size < MIN_FILE_SIZE) {
        const errorMsg = `File too small: ${file.name}. Minimum size is ${MIN_FILE_SIZE} bytes.`;
        setUploadError(errorMsg);
        toast.error(errorMsg);
        console.error('[DocumentsTab]', errorMsg);
        continue;
      }

      // Validate file size based on type
      const maxSize = fileExtension === 'pdf' ? MAX_PDF_SIZE : MAX_TEXT_SIZE;
      const maxSizeLabel = fileExtension === 'pdf' ? '5MB' : '1MB';
      if (file.size > maxSize) {
        const errorMsg = `File too large: ${file.name}. Maximum size for ${fileExtension?.toUpperCase()} is ${maxSizeLabel}.`;
        setUploadError(errorMsg);
        toast.error(errorMsg);
        console.error('[DocumentsTab]', errorMsg);
        continue;
      }

      // Start upload overlay immediately
      startUpload(file.name);

      if (fileExtension === 'txt') {
        // Read and upload text file
        console.log('[DocumentsTab] Reading text file:', file.name);
        const reader = new FileReader();

        reader.onload = (e) => {
          const text = e.target?.result as string;

          // Validate minimum text length
          if (text.trim().length < MIN_TEXT_LENGTH) {
            const errorMsg = `File too short: ${file.name}. Minimum ${MIN_TEXT_LENGTH} characters required.`;
            setUploadError(errorMsg);
            toast.error(errorMsg);
            endUpload();
            return;
          }

          console.log('[DocumentsTab] Text file read successfully, uploading...');

          uploadTextMutation.mutate(
            {
              agent_id: agentId,
              filename: file.name,
              text,
              file_type: 'text/plain',
              storage_url: '',
            },
            {
              onSuccess: (data) => {
                console.log('[DocumentsTab] Text upload successful:', data);
                toast.success(`${file.name} uploaded successfully`);
                setUploadError(null);
                endUpload();
              },
              onError: (error) => {
                const errorMsg = `Failed to upload ${file.name}: ${error.message}`;
                console.error('[DocumentsTab] Text upload failed:', error);
                setUploadError(errorMsg);
                toast.error(errorMsg);
                endUpload();
              },
            }
          );
        };

        reader.onerror = () => {
          const errorMsg = `Failed to read file: ${file.name}`;
          console.error('[DocumentsTab] FileReader error');
          setUploadError(errorMsg);
          toast.error(errorMsg);
          endUpload();
        };

        reader.readAsText(file);
      } else if (fileExtension === 'pdf') {
        // Upload PDF file
        console.log('[DocumentsTab] Uploading PDF:', file.name);

        uploadPDFMutation.mutate(
          {
            agentId,
            file,
            filename: file.name,
          },
          {
            onSuccess: (data) => {
              console.log('[DocumentsTab] PDF upload successful:', data);
              toast.success(`${file.name} uploaded successfully`);
              setUploadError(null);
              endUpload();
            },
            onError: (error) => {
              const errorMsg = `Failed to upload ${file.name}: ${error.message}`;
              console.error('[DocumentsTab] PDF upload failed:', error);
              setUploadError(errorMsg);
              toast.error(errorMsg);
              endUpload();
            },
          }
        );
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDownload = (storageUrl: string, filename: string) => {
    // Download from storage URL
    const link = window.document.createElement('a');
    link.href = storageUrl;
    link.download = filename;
    link.click();
  };

  const handleDelete = (documentId: number, filename: string) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      console.log('[DocumentsTab] Deleting document:', { documentId, filename });

      deleteDocumentMutation.mutate(documentId, {
        onSuccess: () => {
          console.log('[DocumentsTab] Document deleted successfully:', filename);
          toast.success(`${filename} deleted successfully`);
        },
        onError: (error) => {
          console.error('[DocumentsTab] Delete failed:', error);
          toast.error(`Failed to delete ${filename}: ${error.message}`);
        },
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('text') || fileType.includes('txt')) return '📝';
    if (fileType.includes('word') || fileType.includes('doc')) return '📄';
    if (fileType.includes('excel') || fileType.includes('csv')) return '📊';
    return '📁';
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!agentId) {
    return (
      <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-[#C9B790]/30 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-[#8B6F47]" />
          </div>
          <CardTitle className="text-xl text-[#8B6F47]">No Agent Found</CardTitle>
          <CardDescription className="text-[#A67A5B]">
            Create an agent first to upload documents
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#8B6F47]">
            <Upload className="h-5 w-5" />
            <span>Upload Documents</span>
          </CardTitle>
          <CardDescription className="text-[#A67A5B]">
            Feed your agent with knowledge documents. Supported formats: PDF, TXT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all overflow-hidden ${
              isUploading
                ? 'border-[#8B6F47] bg-[#F5F0E8]'
                : dragActive
                ? 'border-[#A67A5B] bg-[#FAF8F3]'
                : 'border-[#D8CBA9] hover:border-[#A67A5B]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* Upload Progress Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-[#F5F0E8]/95 flex flex-col items-center justify-center z-10">
                {/* Animated progress bar */}
                <div className="w-3/4 max-w-xs mb-4">
                  <div className="h-3 bg-[#E8DCC8] rounded-full overflow-hidden relative">
                    {/* Animated fill */}
                    <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9A86C] rounded-full animate-upload-progress" />
                    {/* Shimmer effect */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s ease-in-out infinite',
                      }}
                    />
                    {/* Bubbles */}
                    <div className="absolute inset-0 overflow-hidden">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-white/50 rounded-full animate-bubble"
                          style={{
                            left: `${15 + i * 18}%`,
                            top: '50%',
                            marginTop: '-4px',
                            animationDelay: `${i * 0.15}s`,
                            animationDuration: `${1 + i * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[#8B6F47] font-medium">
                  Uploading {uploadingFileName || 'file'}...
                </p>
                <p className="text-sm text-[#A67A5B] mt-1">
                  Processing and creating embeddings
                </p>
              </div>
            )}

            <div className={`space-y-4 ${isUploading ? 'opacity-30' : ''}`}>
              <div className="mx-auto w-12 h-12 bg-[#C9B790]/30 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#8B6F47]" />
              </div>
              <div>
                <p className="text-lg font-medium text-[#8B6F47]">
                  {dragActive ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-sm text-[#A67A5B]">
                  or click to browse files
                </p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Choose Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.txt"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </div>

          {/* Error Display */}
          {uploadError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Upload Error</p>
                <p className="text-sm text-red-600 mt-1">{uploadError}</p>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#8B6F47]">
            <FileText className="h-5 w-5" />
            <span>Knowledge Base</span>
          </CardTitle>
          <CardDescription className="text-[#A67A5B]">
            Documents that your agent can reference during conversations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 border-4 border-[#C9B790] border-t-[#8B6F47] rounded-full animate-spin"></div>
              <p className="mt-4 text-[#A67A5B]">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-[#C9B790]/30 rounded-full flex items-center justify-center mb-4">
                <File className="w-8 h-8 text-[#8B6F47]" />
              </div>
              <h3 className="text-lg font-medium text-[#8B6F47] mb-2">
                No documents yet
              </h3>
              <p className="text-[#A67A5B]">
                Upload some documents using the section above to help your agent answer questions better
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((document) => {
                const isProcessing = document.status === 'processing';
                const hasError = document.status === 'error';

                return (
                  <div
                    key={document.id}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                      isProcessing ? 'bg-[#FAF8F3] border-[#E8DCC8]' :
                      hasError ? 'bg-red-50 border-red-200' :
                      'hover:bg-[#FAF8F3]'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl relative">
                        {isProcessing ? (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-[#8B6F47] animate-spin" />
                          </div>
                        ) : (
                          getFileIcon(document.file_type)
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-[#8B6F47]">{document.filename}</h4>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-[#A67A5B]">
                          <span>{document.file_type.split('/').pop()?.toUpperCase()}</span>
                          {document.file_size && (
                            <>
                              <span>•</span>
                              <span>{(document.file_size / 1024).toFixed(1)} KB</span>
                            </>
                          )}
                          {isProcessing ? (
                            <>
                              <span>•</span>
                              <span className="text-[#8B6F47] font-medium">Processing chunks...</span>
                            </>
                          ) : hasError ? (
                            <>
                              <span>•</span>
                              <span className="text-red-500">Failed: {document.error_message || 'Unknown error'}</span>
                            </>
                          ) : (
                            <>
                              <span>•</span>
                              <span>{document.chunk_count || 0} chunks</span>
                              <span>•</span>
                              <span>Uploaded {formatDate(document.uploaded_at)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!isProcessing && document.storage_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(document.storage_url, document.filename)}
                          className="border-[#D8CBA9] text-[#8B6F47] hover:bg-[#FAF8F3] hover:border-[#A67A5B] hover:text-[#8B6F47] shadow-sm hover:shadow-md transition-all"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(document.id, document.filename)}
                        disabled={deleteDocumentMutation.isPending || isProcessing}
                        className="border-[#D8CBA9] text-[#8B6F47] hover:bg-red-50 hover:border-red-300 hover:text-red-600 shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-[#FAF8F3] border-[#E8DCC8]">
        <CardHeader>
          <CardTitle className="text-[#8B6F47]">Pro Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-[#A67A5B]">
          <ul className="space-y-2 text-sm">
            <li>• Upload FAQ documents to help your agent answer common questions</li>
            <li>• Product manuals help your agent provide detailed technical support</li>
            <li>• Company policies ensure consistent responses across all calls</li>
            <li>• <strong>File limits:</strong> PDF up to 5MB, TXT up to 1MB</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
