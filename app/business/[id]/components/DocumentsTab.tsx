'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download, Trash2, File, AlertCircle } from 'lucide-react';
import { useDocuments, useUploadPDFDocument, useDeleteDocument } from '@/lib/hooks/use-documents';

interface DocumentsTabProps {
  agentId?: number;
}

export default function DocumentsTab({ agentId }: DocumentsTabProps) {
  const { data: documents = [], isLoading } = useDocuments(agentId || 0);
  const uploadPDFMutation = useUploadPDFDocument();
  const deleteDocumentMutation = useDeleteDocument();

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    if (!agentId) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Upload PDF file
      uploadPDFMutation.mutate({
        agentId,
        file,
        filename: file.name,
      });
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

  const handleDelete = (documentId: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocumentMutation.mutate(documentId);
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
          <CardDescription className="text-[#A67A5B]/70">
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
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Documents</span>
          </CardTitle>
          <CardDescription className="text-[#A67A5B]/70">
            Feed your agent with knowledge documents. Supported format: PDF
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-[#A67A5B] bg-[#FAF8F3]'
                : 'border-[#D8CBA9] hover:border-[#A67A5B]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-[#C9B790]/30 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#8B6F47]" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {dragActive ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-sm text-[#A67A5B]/70">
                  or click to browse files
                </p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadPDFMutation.isPending}
                className="bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {uploadPDFMutation.isPending ? 'Uploading...' : 'Choose Files'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Knowledge Base</span>
          </CardTitle>
          <CardDescription className="text-[#A67A5B]/70">
            Documents that your agent can reference during conversations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 border-4 border-[#C9B790] border-t-[#8B6F47] rounded-full animate-spin"></div>
              <p className="mt-4 text-[#A67A5B]/70">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-[#C9B790]/30 rounded-full flex items-center justify-center mb-4">
                <File className="w-8 h-8 text-[#8B6F47]" />
              </div>
              <h3 className="text-lg font-medium text-[#8B6F47] mb-2">
                No documents yet
              </h3>
              <p className="text-[#A67A5B]/70 mb-4">
                Upload some documents to help your agent answer questions better
              </p>
              <Button onClick={() => fileInputRef.current?.click()} className="bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Document
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-[#FAF8F3]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getFileIcon(document.file_type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{document.filename}</h4>
                      <div className="flex items-center space-x-4 text-sm text-[#A67A5B]/70">
                        <span>{document.file_type.toUpperCase()}</span>
                        <span>•</span>
                        <span>Uploaded {formatDate(document.uploaded_at)}</span>
                        {document.error_message && (
                          <>
                            <span>•</span>
                            <span className="text-red-500">Error: {document.error_message}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(document.storage_url, document.filename)}
                      className="border-[#D8CBA9] text-[#8B6F47] hover:bg-[#FAF8F3] hover:border-[#A67A5B] shadow-sm hover:shadow-md transition-all"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(document.id)}
                      disabled={deleteDocumentMutation.isPending}
                      className="border-[#D8CBA9] text-[#8B6F47] hover:bg-[#FAF8F3] hover:border-[#A67A5B] shadow-sm hover:shadow-md transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
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
            <li>• Keep documents up to date for the best customer experience</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
