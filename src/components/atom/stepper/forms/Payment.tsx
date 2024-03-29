import React, {
  ChangeEvent,
  ChangeEventHandler,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { HiArrowSmLeft, HiOutlineInformationCircle } from 'react-icons/hi';
import * as yup from 'yup';
import { FcCurrencyExchange } from 'react-icons/fc';
import { CgArrowsExchangeAltV } from 'react-icons/cg';
import CurrencyFlag from 'react-currency-flags';
import { useDispatch, useSelector } from 'react-redux';
//@ts-ignore
import { countries } from 'country-data';
import { useStepContext } from '@/context/StepContext';
import {
  convertCurrency,
  generateWithoutStripe,
  savePatient,
} from '@/lib/helper';
import { RootStatePatient } from '@/redux/rootReducerPatient';
import { setPatientDispatch } from '@/redux/reducerPatient';
import { useMutation } from 'react-query';
import { useSession } from 'next-auth/react';
import { UserType } from '@/Interfaces/interfaces';
import { StateDataProps } from './Identity';
import toast from 'react-hot-toast';

interface Symbol {
  country: string;
  code: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  country: string;
  countryLabel?: string;
  city?: string;
  homeAddress?: string;
}

const Payment: React.FC = () => {
  const { activeStepIndex, setActiveStepIndex } = useStepContext();

  const storedValue = localStorage.getItem('dispatchBuyVoucher');
  const initialAmount = storedValue ? JSON.parse(storedValue).amount : 0;

  const [amount, setAmount] = useState(initialAmount);
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const client = useSelector(
    (state: RootStatePatient) => state?.patient?.client,
  );
  const { data: session } = useSession();
  const userState = session?.user as UserType;

  useEffect(() => {
    const datas = {
      success: true,
      symbols: {
        // AED: 'United Arab Emirates Dirham',
        // AFN: 'Afghan Afghani',
        // ALL: 'Albanian Lek',
        // AMD: 'Armenian Dram',
        // ANG: 'Netherlands Antillean Guilder',
        // AOA: 'Angolan Kwanza',
        // ARS: 'Argentine Peso',
        // AUD: 'Australian Dollar',
        // AWG: 'Aruban Florin',
        // AZN: 'Azerbaijani Manat',
        // BAM: 'Bosnia-Herzegovina Convertible Mark',
        // BBD: 'Barbadian Dollar',
        // BDT: 'Bangladeshi Taka',
        // BGN: 'Bulgarian Lev',
        // BHD: 'Bahraini Dinar',
        // BIF: 'Burundian Franc',
        // BMD: 'Bermudan Dollar',
        // BND: 'Brunei Dollar',
        // BOB: 'Bolivian Boliviano',
        // BRL: 'Brazilian Real',
        // BSD: 'Bahamian Dollar',
        // BTC: 'Bitcoin',
        // BTN: 'Bhutanese Ngultrum',
        // BWP: 'Botswanan Pula',
        // BYN: 'New Belarusian Ruble',
        // BYR: 'Belarusian Ruble',
        // BZD: 'Belize Dollar',
        // CAD: 'Canadian Dollar',
        CDF: 'Congolese Franc',
        // CHF: 'Swiss Franc',
        // CLF: 'Chilean Unit of Account (UF)',
        // CLP: 'Chilean Peso',
        // CNY: 'Chinese Yuan',
        // COP: 'Colombian Peso',
        // CRC: 'Costa Rican Colón',
        // CUC: 'Cuban Convertible Peso',
        // CUP: 'Cuban Peso',
        // CVE: 'Cape Verdean Escudo',
        // CZK: 'Czech Republic Koruna',
        // DJF: 'Djiboutian Franc',
        // DKK: 'Danish Krone',
        // DOP: 'Dominican Peso',
        // DZD: 'Algerian Dinar',
        // EGP: 'Egyptian Pound',
        // ERN: 'Eritrean Nakfa',
        // ETB: 'Ethiopian Birr',
        EUR: 'Euro',
        // FJD: 'Fijian Dollar',
        // FKP: 'Falkland Islands Pound',
        // GBP: 'British Pound Sterling',
        // GEL: 'Georgian Lari',
        // GGP: 'Guernsey Pound',
        // GHS: 'Ghanaian Cedi',
        // GIP: 'Gibraltar Pound',
        // GMD: 'Gambian Dalasi',
        // GNF: 'Guinean Franc',
        // GTQ: 'Guatemalan Quetzal',
        // GYD: 'Guyanaese Dollar',
        // HKD: 'Hong Kong Dollar',
        // HNL: 'Honduran Lempira',
        // HRK: 'Croatian Kuna',
        // HTG: 'Haitian Gourde',
        // HUF: 'Hungarian Forint',
        // IDR: 'Indonesian Rupiah',
        // ILS: 'Israeli New Sheqel',
        // IMP: 'Manx pound',
        // INR: 'Indian Rupee',
        // IQD: 'Iraqi Dinar',
        // IRR: 'Iranian Rial',
        // ISK: 'Icelandic Króna',
        // JEP: 'Jersey Pound',
        // JMD: 'Jamaican Dollar',
        // JOD: 'Jordanian Dinar',
        // JPY: 'Japanese Yen',
        // KES: 'Kenyan Shilling',
        // KGS: 'Kyrgystani Som',
        // KHR: 'Cambodian Riel',
        // KMF: 'Comorian Franc',
        // KPW: 'North Korean Won',
        // KRW: 'South Korean Won',
        // KWD: 'Kuwaiti Dinar',
        // KYD: 'Cayman Islands Dollar',
        // KZT: 'Kazakhstani Tenge',
        // LAK: 'Laotian Kip',
        // LBP: 'Lebanese Pound',
        // LKR: 'Sri Lankan Rupee',
        // LRD: 'Liberian Dollar',
        // LSL: 'Lesotho Loti',
        // LTL: 'Lithuanian Litas',
        // LVL: 'Latvian Lats',
        // LYD: 'Libyan Dinar',
        // MAD: 'Moroccan Dirham',
        // MDL: 'Moldovan Leu',
        // MGA: 'Malagasy Ariary',
        // MKD: 'Macedonian Denar',
        // MMK: 'Myanma Kyat',
        // MNT: 'Mongolian Tugrik',
        // MOP: 'Macanese Pataca',
        // MRO: 'Mauritanian Ouguiya',
        // MUR: 'Mauritian Rupee',
        // MVR: 'Maldivian Rufiyaa',
        // MWK: 'Malawian Kwacha',
        // MXN: 'Mexican Peso',
        // MYR: 'Malaysian Ringgit',
        // MZN: 'Mozambican Metical',
        // NAD: 'Namibian Dollar',
        // NGN: 'Nigerian Naira',
        // NIO: 'Nicaraguan Córdoba',
        // NOK: 'Norwegian Krone',
        // NPR: 'Nepalese Rupee',
        // NZD: 'New Zealand Dollar',
        // OMR: 'Omani Rial',
        // PAB: 'Panamanian Balboa',
        // PEN: 'Peruvian Nuevo Sol',
        // PGK: 'Papua New Guinean Kina',
        // PHP: 'Philippine Peso',
        // PKR: 'Pakistani Rupee',
        // PLN: 'Polish Zloty',
        // PYG: 'Paraguayan Guarani',
        // QAR: 'Qatari Rial',
        // RON: 'Romanian Leu',
        // RSD: 'Serbian Dinar',
        // RUB: 'Russian Ruble',
        // RWF: 'Rwandan Franc',
        // SAR: 'Saudi Riyal',
        // SBD: 'Solomon Islands Dollar',
        // SCR: 'Seychellois Rupee',
        // SDG: 'Sudanese Pound',
        // SEK: 'Swedish Krona',
        // SGD: 'Singapore Dollar',
        // SHP: 'Saint Helena Pound',
        // SLE: 'Sierra Leonean Leone',
        // SLL: 'Sierra Leonean Leone',
        // SOS: 'Somali Shilling',
        // SRD: 'Surinamese Dollar',
        // STD: 'São Tomé and Príncipe Dobra',
        // SVC: 'Salvadoran Colón',
        // SYP: 'Syrian Pound',
        // SZL: 'Swazi Lilangeni',
        // THB: 'Thai Baht',
        // TJS: 'Tajikistani Somoni',
        // TMT: 'Turkmenistani Manat',
        // TND: 'Tunisian Dinar',
        // TOP: 'Tongan Paʻanga',
        // TRY: 'Turkish Lira',
        // TTD: 'Trinidad and Tobago Dollar',
        // TWD: 'New Taiwan Dollar',
        // TZS: 'Tanzanian Shilling',
        // UAH: 'Ukrainian Hryvnia',
        // UGX: 'Ugandan Shilling',
        USD: 'United States Dollar',
        // UYU: 'Uruguayan Peso',
        // UZS: 'Uzbekistan Som',
        // VEF: 'Venezuelan Bolívar Fuerte',
        // VES: 'Sovereign Bolivar',
        // VND: 'Vietnamese Dong',
        // VUV: 'Vanuatu Vatu',
        // WST: 'Samoan Tala',
        // XAF: 'CFA Franc BEAC',
        // XAG: 'Silver (troy ounce)',
        // XAU: 'Gold (troy ounce)',
        // XCD: 'East Caribbean Dollar',
        // XDR: 'Special Drawing Rights',
        XOF: 'CFA Franc',
        // XPF: 'CFP Franc',
        // YER: 'Yemeni Rial',
        // ZAR: 'South African Rand',
        // ZMK: 'Zambian Kwacha (pre-2013)',
        // ZMW: 'Zambian Kwacha',
        // ZWL: 'Zimbabwean Dollar',
      },
    };

    let symbol: Symbol[] = [];

    for (const property in datas.symbols) {
      if (datas.symbols.hasOwnProperty(property)) {
        symbol.push({
          country: datas.symbols[property as keyof typeof datas.symbols],
          code: property,
        });
      }
    }

    setSymbols(symbol);
  }, []);

  const storedPatientJson = localStorage.getItem('dispatchBuyVoucher');
  const patient: Patient | null = storedPatientJson
    ? JSON.parse(storedPatientJson)
    : null;

  return (
    <Amount
      amount={amount}
      setAmount={setAmount}
      symbols={symbols}
      patient={client?.patient as Patient}
      setActiveStepIndex={setActiveStepIndex}
      activeStepIndex={activeStepIndex}
      user={userState}
    />
  );
};

interface AmountDataProps {
  amount: number;
  setAmount: (amount: number) => void;
  symbols: Symbol[];
  setActiveStepIndex: (amount: number) => void;
  activeStepIndex: number;
  patient?: Patient;
  user?: UserType;
}

const Amount: React.FC<AmountDataProps> = ({
  amount,
  setAmount,
  symbols,
  patient: patientRedux,
  setActiveStepIndex,
  activeStepIndex,
  user,
}) => {
  const ValidationSchema = yup.object().shape({
    amount: yup.number().required('Please enter valid amount').min(2),
  });

  const storedPatientJson = localStorage.getItem('dispatchBuyVoucher');
  const patient: Patient | null = storedPatientJson
    ? JSON.parse(storedPatientJson)
    : null;

  const [currencyPatient, setCurrencyPatient] = useState<string>(
    countries['CD'].currencies[0],
  );
  const [state, setState] = useState<StateDataProps>({ type: 0, message: '' });
  const [currencyPatientName, setCurrencyPatientName] = useState<string>('USD');

  const [currencySender, setCurrencySender] = useState<string>('EUR');
  const [convertRequest, setConvertRequest] = useState<boolean>(false);
  const [convertResult, setConvertResult] = useState<any | null>(null);
  const [amountTemp, setAmountTemp] = useState<number | null>(null);
  const dispatch = useDispatch();

  const renderError = (message: string) => (
    <p className="text-xs text-red-600 font-light flex items-center gap-1">
      <HiOutlineInformationCircle />
      {message}
    </p>
  );

  const convertAutomatically = async (e: ChangeEvent<HTMLInputElement>) => {
    e.currentTarget.value && setAmountTemp(Number(e.currentTarget.value));

    setConvertRequest(true);
    const res = await convertCurrency(
      currencySender,
      Number(e?.target?.value) ?? amountTemp,
      currencyPatient,
    );

    setConvertRequest(false);
    setConvertResult(res);
  };

  const convertAutomaticallyOnFirstSelect = async (
    e: ChangeEvent<HTMLSelectElement>,
  ) => {
    // e.currentTarget.value && setAmountTemp(Number(e.currentTarget.value));

    setConvertRequest(true);
    const res = await convertCurrency(
      e.currentTarget.value,
      Number(amountTemp),
      currencyPatient,
    );

    setConvertRequest(false);
    setConvertResult(res);
  };

  const convertAutomaticallyOnSecondSelect = async (
    e: ChangeEvent<HTMLSelectElement>,
  ) => {
    setConvertRequest(true);
    const res = await convertCurrency(
      currencySender,
      Number(amountTemp),
      e.currentTarget.value,
    );

    setConvertRequest(false);
    setConvertResult(res);
  };

  const saveGenerateMutation = useMutation(generateWithoutStripe, {
    onSuccess: (res) => {
      console.log(res.stripePaymentId);

      if (res.error) {
        toast.error(res.message ?? res.error);
        // setState({ type: 2, message: res.message ?? res.error });
        // setTimeout(() => {
        //     setState({ type: 0, message: '' });
        // }, 3000);
      } else {
        toast.success('Pass santé généré');
        // setState({ type: 1, message: 'Pass santé généré' });

        dispatch(
          setPatientDispatch({
            ...patient,
            stripePaymentId: res.stripePaymentId,
          }),
        );

        setActiveStepIndex(activeStepIndex + 1);
      }
    },
  });

  return (
    <Formik
      initialValues={{
        amount: '',
      }}
      onSubmit={(values) => {
        if (!amountTemp || amountTemp <= 1)
          return alert(
            `Le montant à envoyé ne peut être inférieur à 1${currencySender}`,
          );

        dispatch(
          setPatientDispatch({
            ...patient,
            currency: {
              patient: currencyPatient,
              patientName: currencyPatientName,
              patientAmount: convertResult.result,
              rate: convertResult.info.rate,
              sender: currencySender,
            },
          }),
        );

        localStorage.setItem(
          'dispatchBuyVoucher',
          JSON.stringify({
            ...patient,
            currency: {
              patient: currencyPatient,
              patientName: currencyPatientName,
              patientAmount: convertResult.result,
              rate: convertResult.info.rate,
              sender: currencySender,
            },
            amount: amountTemp,
          }),
        );
        setAmount(amountTemp);

        saveGenerateMutation.mutate({
          senderId: user?.data?.userId as string,
          patientId: patient?.id as string,
          currencyPatientAmount: convertResult.result,
          currencyPatient: convertResult.query.to,
          currencyRate: convertResult.info.rate,
          senderAmount: convertResult.query.amount,
          senderCurrency: convertResult.query.from,
          accessToken: user?.id,
        });
      }}
    >
      <Form className="flex justify-center w-full  py-4 items-end">
        <div className="grid lg:grid-cols-2 lg:px-10 gap-6">
          <div className="px-4 pt-8">
            <div className="flex gap-2 items-center mb-3">
              <button
                className="border border-gray-300 rounded-xl py-1 px-2 hover:bg-gray-200"
                type="button"
                onClick={() => setActiveStepIndex(activeStepIndex - 1)}
              >
                <HiArrowSmLeft size={24} />
              </button>
              <p className="text-xl font-medium">Details du Patient</p>
            </div>
            <p className="text-gray-400 text-xs">
              Confirmer les informations et choisissez la methode de paiement
            </p>

            <div className="items-center sm:flex w-full">
              <div className="py-5 w-full">
                <h3 className="text-xl font-bold tracking-tight text-gray-900 ">
                  <a href="#">
                    {patient?.firstName ?? 'John'}{' '}
                    {patient?.lastName?.toUpperCase() ?? 'Doe'}
                  </a>
                </h3>
                <span className="text-gray-500 ">{patient?.email ?? ''}</span>
                <p className="mt-3 mb-4 font-light text-gray-500 w-full">
                  <ul className="flex flex-col gap-1 w-full text-sm">
                    <li className="flex justify-between w-full">
                      Numéro de téléphone:{' '}
                      <b className="text-orange">
                        {patient?.phoneNumber ?? '+243 000 000 000'}
                      </b>
                    </li>
                    <li className="flex justify-between w-full">
                      Pays:{' '}
                      <b className="text-gray-700 flex gap-1 items-center">
                        <img
                          src={`https://flagcdn.com/w20/${
                            patient?.country ?? 'cd'
                          }.png`}
                          alt="cd"
                          width={20}
                          height={20}
                          className="rounded-full h-4 w-4 object-cover"
                        />{' '}
                        {
                          countries[patient?.country?.toUpperCase() ?? 'CD']
                            .name
                        }
                      </b>
                    </li>
                    <li className="flex justify-between w-full">
                      Ville:{' '}
                      <b className="text-gray-700">{patient?.city ?? 'Goma'}</b>
                    </li>
                    <li className="flex justify-between w-full">
                      Adresse du domicile:{' '}
                      <b className="text-gray-700">{patient?.homeAddress}</b>
                    </li>
                  </ul>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 bg-gray-50 px-4 pt-8 lg:mt-0">
            <p className="text-xl font-medium">Détails de paiement</p>
            <p className="text-gray-400 text-xs mb-4">
              Complétez votre commande en fournissant vos informations de
              paiement.
            </p>
            <div className="">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="hs-inline-leading-pricing-select-label"
                    className="block text-sm font-medium mb-2 "
                  >
                    Devise de départ
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="hs-inline-leading-pricing-select-label"
                      name="amount"
                      className="py-3 px-4 pl-9 pr-20 block w-full border-gray-200 shadow-sm rounded-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 "
                      placeholder="0.00"
                      onChange={convertAutomatically}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                      <span className="text-gray-500">
                        {currencySender == 'EUR' ? '€' : '$'}
                      </span>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center text-gray-500 pr-px">
                      <label
                        htmlFor="hs-inline-leading-select-currency"
                        className="sr-only"
                      >
                        Currency
                      </label>
                      <select
                        id="hs-inline-leading-select-currency"
                        name="hs-inline-leading-select-currency"
                        className="block w-full border-transparent rounded-md focus:ring-orange focus:border-blue-600 "
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                          setCurrencySender(e.target.value);
                          convertAutomaticallyOnFirstSelect(e);
                        }}
                      >
                        <option>USD</option>
                        <option selected>EUR</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 items-center justify-center">
                  {convertRequest ? (
                    <>
                      <div
                        className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-gray-400 rounded-full"
                        role="status"
                        aria-label="loading"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Conversion en cours...
                      </span>
                    </>
                  ) : (
                    <CgArrowsExchangeAltV size={40} className="text-gray-400" />
                  )}
                </div>

                <div>
                  <label
                    htmlFor="hs-inline-leading-pricing-select-label"
                    className="block text-sm font-medium mb-2 "
                  >
                    À quel devise voulez-vous l&apos;envoyer{' '}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="hs-inline-leading-pricing-select-label"
                      name="inline-add-on"
                      className="py-3 px-4 pl-14 pr-20 block w-full border-gray-200 shadow-sm rounded-md text-sm focus:z-10 focus:border-orange focus:ring-orange "
                      placeholder="0.00"
                      readOnly
                      value={convertResult?.result ?? ''}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                      <span className="text-gray-500">{currencyPatient}</span>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center text-gray-500 pr-px">
                      <label
                        htmlFor="hs-inline-leading-select-currency"
                        className="sr-only"
                      >
                        Currency
                      </label>
                      <select
                        id="hs-inline-leading-select-currency"
                        name="hs-inline-leading-select-currency"
                        className="block  border-transparent rounded-md focus:ring-orange focus:border-orange w-[5.5rem]"
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                          const selectedValue = e.target.value;
                          setCurrencyPatient(selectedValue || ''); // Utilisez une chaîne vide comme valeur par défaut si c'est null
                          setCurrencyPatientName(
                            selectedValue
                              ? e.target.options[
                                  e.target.selectedIndex
                                ].getAttribute('currency') || ''
                              : '',
                          );
                          convertAutomaticallyOnSecondSelect(e);
                        }}
                      >
                        {symbols.map((symbol, index) => (
                          <option
                            key={index}
                            value={symbol.code}
                            // currency={symbol.country}
                            selected={symbol.code == currencyPatient}
                          >
                            {symbol.code} {symbol.country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-b py-2 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Devise d&apos;envoie
                  </p>
                  <p className="font-normal text-sm text-gray-600">
                    {currencySender}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Devise de réception
                  </p>
                  <p className="font-normal text-sm text-gray-600">
                    {currencyPatient}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Monnaie</p>
                  <p className="font-normal text-sm text-gray-600 flex items-center gap-2">
                    <CurrencyFlag
                      currency={currencyPatient}
                      className="rounded-full !h-4 !w-4 object-cover"
                    />
                    {currencyPatientName}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Taux d&apos;échange
                  </p>
                  <p className="font-normal text-sm text-gray-600">
                    {currencySender == 'EUR' ? '€' : '$'} 1.00 ={' '}
                    <span className="text-orange">
                      {convertResult?.info?.rate.toFixed(2) ?? ''}{' '}
                      {currencyPatient ?? convertResult?.query?.to}
                    </span>
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Frais WiiQare
                  </p>
                  <p className="font-normal text-sm text-gray-600">0%</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {currencySender == 'EUR' ? '€' : '$'} {amountTemp ?? 0}
                </p>
              </div>
            </div>
            <button
              type="submit"
              disabled={convertRequest || saveGenerateMutation.isLoading}
              className="mt-4 mb-8 w-full rounded-md bg-orange disabled:bg-gray-300 effect-up px-6 py-3 font-medium text-white"
            >
              {saveGenerateMutation.isLoading
                ? 'Pass santé en cours...'
                : 'Passer au paiement'}
            </button>
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default Payment;
