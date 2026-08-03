import React from 'react';
import { Database, Layers } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';

interface DatasetItem {
  id: string;
  name: string;
  type: string;
  rows: number;
  cols: number;
  desc: string;
}

interface DatasetSelectorProps {
  datasets: DatasetItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  datasets,
  selectedId,
  onSelect,
  disabled = false,
}) => {
  return (
    <Card>
      <CardHeader
        title="Source Data Asset"
        icon={<Database className="w-4 h-4 text-indigo-600" />}
        action={<Badge variant="info">Verified</Badge>}
      />
      <CardBody className="space-y-3.5 p-4">
        {datasets.map((d) => {
          const isSelected = selectedId === d.id;
          return (
            <div
              key={d.id}
              onClick={() => !disabled && onSelect(d.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border relative ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-50/90 to-purple-50/60 border-indigo-300/80 shadow-sm'
                  : 'bg-white/80 border-slate-200 hover:border-indigo-200 hover:bg-slate-50/70'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isSelected && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-r-full" />
              )}
              <div className="flex justify-between items-center font-medium mb-1.5 pl-1">
                <span className={`text-sm md:text-base ${isSelected ? 'text-indigo-900 font-semibold' : 'text-slate-800'}`}>
                  {d.name}
                </span>
                <Badge variant={d.type === 'Regression' ? 'purple' : 'info'}>{d.type}</Badge>
              </div>
              <p className="text-xs text-slate-500 mb-2 pl-1 leading-relaxed">{d.desc}</p>
              <div className="flex items-center text-xs text-slate-400 font-mono pl-1 space-x-3">
                <span className="flex items-center">
                  <Layers className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {d.rows.toLocaleString()} rows
                </span>
                <span>•</span>
                <span>{d.cols} attributes</span>
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};
