import { Download, CheckCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DownloadProgressProps {
  progress: number;
  fileName: string;
  fileSize?: string;
  isComplete: boolean;
  onSave: () => void;
  onCancel: () => void;
  onDownloadAnother: () => void;
}

const DownloadProgress = ({
  progress,
  fileName,
  fileSize,
  isComplete,
  onSave,
  onCancel,
  onDownloadAnother,
}: DownloadProgressProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <Card className="bg-card border-border p-6">
        {!isComplete ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Baixando...</p>
                  <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                    {fileName}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{Math.round(progress)}% concluído</span>
                {fileSize && <span>{fileSize}</span>}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Download concluído!</p>
                <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                  {fileName} {fileSize && `(${fileSize})`}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={onSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Salvar no PC
              </Button>
              <Button
                variant="outline"
                onClick={onDownloadAnother}
              >
                Baixar outro formato
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DownloadProgress;
