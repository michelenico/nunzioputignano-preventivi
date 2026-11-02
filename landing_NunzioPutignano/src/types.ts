export interface QuoteRequest {
  id?: string;
  fullName: string;
  phoneNumber: string;
  carModel: string;
  vin: string;
  serviceType?: string;
  notes: string;
  status?: 'nuova' | 'contattato' | 'in_lavorazione' | 'completata';
  createdAt?: any;
}

export type ServiceTypeOption = 
  | 'Diagnosi elettronica'
  | 'Riparazioni meccaniche'
  | 'Tagliandi e manutenzione'
  | 'Pneumatici'
  | 'Revisioni'
  | 'Altro intervento';
