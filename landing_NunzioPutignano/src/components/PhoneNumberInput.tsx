import React, { useState } from 'react';

const countries = [
  { code: 'IT', name: 'Italia', dialCode: '+39' },
  { code: 'AL', name: 'Albania', dialCode: '+355' },
  { code: 'AR', name: 'Argentina', dialCode: '+54' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'AT', name: 'Austria', dialCode: '+43' },
  { code: 'BE', name: 'Belgio', dialCode: '+32' },
  { code: 'BA', name: 'Bosnia ed Erzegovina', dialCode: '+387' },
  { code: 'BR', name: 'Brasile', dialCode: '+55' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'CL', name: 'Cile', dialCode: '+56' },
  { code: 'CN', name: 'Cina', dialCode: '+86' },
  { code: 'CO', name: 'Colombia', dialCode: '+57' },
  { code: 'HR', name: 'Croazia', dialCode: '+385' },
  { code: 'DK', name: 'Danimarca', dialCode: '+45' },
  { code: 'EG', name: 'Egitto', dialCode: '+20' },
  { code: 'AE', name: 'Emirati Arabi Uniti', dialCode: '+971' },
  { code: 'PH', name: 'Filippine', dialCode: '+63' },
  { code: 'FI', name: 'Finlandia', dialCode: '+358' },
  { code: 'FR', name: 'Francia', dialCode: '+33' },
  { code: 'DE', name: 'Germania', dialCode: '+49' },
  { code: 'JP', name: 'Giappone', dialCode: '+81' },
  { code: 'GR', name: 'Grecia', dialCode: '+30' },
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62' },
  { code: 'IE', name: 'Irlanda', dialCode: '+353' },
  { code: 'IS', name: 'Islanda', dialCode: '+354' },
  { code: 'IL', name: 'Israele', dialCode: '+972' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60' },
  { code: 'MA', name: 'Marocco', dialCode: '+212' },
  { code: 'MX', name: 'Messico', dialCode: '+52' },
  { code: 'ME', name: 'Montenegro', dialCode: '+382' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234' },
  { code: 'NO', name: 'Norvegia', dialCode: '+47' },
  { code: 'NZ', name: 'Nuova Zelanda', dialCode: '+64' },
  { code: 'NL', name: 'Paesi Bassi', dialCode: '+31' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92' },
  { code: 'PL', name: 'Polonia', dialCode: '+48' },
  { code: 'PT', name: 'Portogallo', dialCode: '+351' },
  { code: 'GB', name: 'Regno Unito', dialCode: '+44' },
  { code: 'CZ', name: 'Repubblica Ceca', dialCode: '+420' },
  { code: 'RO', name: 'Romania', dialCode: '+40' },
  { code: 'RU', name: 'Russia', dialCode: '+7' },
  { code: 'SN', name: 'Senegal', dialCode: '+221' },
  { code: 'RS', name: 'Serbia', dialCode: '+381' },
  { code: 'SG', name: 'Singapore', dialCode: '+65' },
  { code: 'SK', name: 'Slovacchia', dialCode: '+421' },
  { code: 'SI', name: 'Slovenia', dialCode: '+386' },
  { code: 'ES', name: 'Spagna', dialCode: '+34' },
  { code: 'US', name: 'Stati Uniti', dialCode: '+1' },
  { code: 'ZA', name: 'Sudafrica', dialCode: '+27' },
  { code: 'SE', name: 'Svezia', dialCode: '+46' },
  { code: 'CH', name: 'Svizzera', dialCode: '+41' },
  { code: 'TH', name: 'Thailandia', dialCode: '+66' },
  { code: 'TN', name: 'Tunisia', dialCode: '+216' },
  { code: 'TR', name: 'Turchia', dialCode: '+90' },
  { code: 'UA', name: 'Ucraina', dialCode: '+380' },
  { code: 'HU', name: 'Ungheria', dialCode: '+36' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84' },
];

interface PhoneNumberInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  theme?: 'light' | 'dark';
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  id,
  value,
  onChange,
  theme = 'light',
}) => {
  const [countryCode, setCountryCode] = useState('IT');
  const country = countries.find((item) => item.code === countryCode) ?? countries[0];
  const isDark = theme === 'dark';
  const nationalNumber = value.replace(/\D/g, '').replace(
    new RegExp(`^${country.dialCode.slice(1)}`),
    '',
  );

  const handleCountryChange = (newCountryCode: string) => {
    const nextCountry = countries.find((item) => item.code === newCountryCode);
    if (!nextCountry) return;

    setCountryCode(nextCountry.code);
    onChange(nationalNumber ? `${nextCountry.dialCode} ${nationalNumber}` : '');
  };

  const handleNumberChange = (input: string) => {
    let nextNationalNumber = input.replace(/\D/g, '');
    const dialCode = country.dialCode.slice(1);
    if (nextNationalNumber.startsWith(dialCode)) {
      nextNationalNumber = nextNationalNumber.slice(dialCode.length);
    }
    onChange(nextNationalNumber ? `${country.dialCode} ${nextNationalNumber}` : '');
  };

  return (
    <div className={`flex overflow-hidden rounded-xl border focus-within:ring-2 focus-within:ring-orange-500 ${
      isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-slate-50'
    }`}>
      <select
        aria-label="Paese e prefisso telefonico"
        value={country.code}
        onChange={(event) => handleCountryChange(event.target.value)}
        className={`w-[54%] shrink-0 border-r px-2 py-3 text-xs focus:outline-none sm:w-[46%] ${
          isDark
            ? 'border-slate-700 bg-slate-900 text-white'
            : 'border-slate-200 bg-slate-50 text-slate-900'
        }`}
      >
        {countries.map((item) => (
          <option key={item.code} value={item.code}>
            {item.name} ({item.dialCode})
          </option>
        ))}
      </select>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        required
        value={nationalNumber}
        onChange={(event) => handleNumberChange(event.target.value)}
        placeholder="Numero di telefono *"
        className={`min-w-0 flex-1 px-3 py-3 text-sm focus:outline-none ${
          isDark
            ? 'bg-slate-900 text-white placeholder:text-slate-500'
            : 'bg-slate-50 text-slate-900 placeholder:text-slate-400'
        }`}
      />
    </div>
  );
};
