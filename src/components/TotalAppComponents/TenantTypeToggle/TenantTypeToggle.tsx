import React from "react";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TenantTypeToggleProps {
  value: boolean; // true = PF, false = PJ
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export const TenantTypeToggle: React.FC<TenantTypeToggleProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        <span 
          className={`text-sm font-semibold transition-colors ${
            !value ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
          }`}
        >
          PJ
        </span>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Switch
                checked={value}
                onCheckedChange={onChange}
                disabled={disabled}
                className={`
                  ${value 
                    ? 'bg-green-600 data-[state=checked]:bg-green-600' 
                    : 'bg-blue-600 data-[state=unchecked]:bg-blue-600'
                  }
                `}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {value ? "Persoană Fizică" : "Persoană Juridică"}
          </TooltipContent>
        </Tooltip>
        
        <span 
          className={`text-sm font-semibold transition-colors ${
            value ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
          }`}
        >
          PF
        </span>
      </div>
    </TooltipProvider>
  );
};