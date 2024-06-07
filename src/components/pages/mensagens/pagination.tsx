import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaginationProps {
  currentPage: number;
  onNext: () => void;
  onPrevious: () => void;
  onLimitChange: (newLimit: number) => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  limit: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onNext,
  onPrevious,
  onLimitChange,
  isPreviousDisabled,
  isNextDisabled,
  limit,
}) => {
  return (
    <div className="mt-4 flex items-center justify-end">
      <div className="flex items-center gap-4">
        <Button onClick={onPrevious} disabled={isPreviousDisabled}>
          Anterior
        </Button>
        <Label>Página {currentPage}</Label>
        <Button onClick={onNext} disabled={isNextDisabled}>
          Próxima
        </Button>
        <Select onValueChange={(value) => onLimitChange(Number(value))} value={String(limit)}>
          <SelectTrigger className="ml-4 w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="8">8</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
