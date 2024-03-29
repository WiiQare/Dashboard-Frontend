import React, { useContext, useState } from 'react';
import { useQRCode } from 'next-qrcode';
//@ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Image from 'next/image';
import logoDark from '../../../../../public/images/logo_dark_2.png';
import Link from 'next/link';
import { HiExclamation, HiLockClosed, HiOutlineEye } from 'react-icons/hi';
import { useMutation } from 'react-query';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { CurrencyFlag } from 'react-currency-flags/dist/components';
import Fetcher from '@/lib/fetcher';
import { UserType } from '@/Interfaces/interfaces';
import { useSelector } from 'react-redux';
import { RootStatePatient } from '@/redux/rootReducerPatient';
import { sendSMSHash } from '@/lib/helper';
import LoadingButton from '../../loader/LoadingButton';
import toast from 'react-hot-toast';

type ClientType = {
  patient?: {
    stripePaymentId?: string;
  };
};

type SliceTextProps = {
  text: string;
};

function Send() {
  const { Canvas } = useQRCode();
  const [copy, setCopy] = useState(false);
  const [view, setView] = useState(false);
  const [loadView, setLoadView] = useState(false);
  const [copyLink, setCopyLink] = useState(false);
  const [state, setState] = useState({ type: 0, message: '' });
  const [data, setData] = useState<any>(null);
  const { data: session } = useSession();
  const userState = session?.user as UserType;
  const { data: _voucherTest, isLoading, isError } = Fetcher(`/`);
  const client = useSelector(
    (state: RootStatePatient) => state?.patient?.client,
  ) as ClientType;

  const handleView = async () => {
    setLoadView(true);
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/voucher?paymentId=${client?.patient?.stripePaymentId}`,
    );

    setLoadView(false);

    if (response.status == 200) {
      toast.success('Pass santé affiché');
      setData(await response.json());
      setView(true);
    } else {
      toast.error('NOT_FOUND VOUCHER');
      setData({ code: 'NOT_FOUND' });
    }
  };

  const sendSMSMutation = useMutation(sendSMSHash, {
    onSuccess: (res) => {
      console.log(res);
      if (!res.code) {
        toast.success('SMS envoyé avec succès');
        // setState({ type: 1, message: 'SMS envoyé avec succès' });
        // setTimeout(() => {
        //     setState({ type: 0, message: '' });
        // }, 3000);
      } else {
        toast.error(res.message ?? res.description);
        // setState({ type: 2, message: res.message ?? res.description });
        // setTimeout(() => {
        //     setState({ type: 0, message: '' });
        // }, 3000);
      }
    },
  });

  const onSubmit = async () => {
    sendSMSMutation.mutate({
      shortenHash: data?.voucherEntity?.shortenHash,
      accessToken: userState.id,
    });
  };

  const closeToast = () => {
    setState({ type: 0, message: '' });
  };

  // Formik hook
  const formik = useFormik({
    initialValues: {},
    onSubmit,
  });

  if (isLoading)
    return (
      <>
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </>
    );

  if (isError)
    return (
      <>
        <div className="flex flex-col gap-6 items-center h-screen w-full overflow-hidden">
          <HiExclamation size={100} className="text-red-600" />
          <span>Error Voucher !</span>
        </div>
      </>
    );

  const SliceText: React.FC<SliceTextProps> = ({ text }) => {
    return text ? (
      <>
        {text.slice(0, 8)}...{text.slice(-7)}
      </>
    ) : (
      ''
    );
  };

  return (
    <div className="flex flex-col gap-6 justify-center items-center">
      {/* {state.type > 0 ? (
                state.type == 2 ? (
                    <Toast type={'danger'} message={state.message} close={closeToast} usePortal={true} extraClass={'fixed z-50 top-20 right-2'} />
                ) : state.type == 1 ? (
                    <Toast type={'success'} message={state.message} close={closeToast} usePortal={true} extraClass={'fixed z-50 top-20 right-2'} />
                ) : (
                    <></>
                )
            ) : (
                <></>
            )} */}
      {view ? (
        <>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex flex-col items-center select-none">
              <Image
                alt="logo"
                src={logoDark}
                className="h-6 md:h-9 object-left object-contain w-min"
              />
              <h1 className="font-extrabold text-gray-700 text-lg hidden md:flex">
                Pass Sante
              </h1>
            </div>
            <span className="text-xs flex items-center gap-1">
              Pass Sante ID:
              <CopyToClipboard
                text={data.voucherEntity.voucherHash}
                onCopy={() => {
                  setCopy(true);
                  setTimeout(() => {
                    setCopy(false);
                  }, 2000);
                }}
              >
                <div className="flex items-center gap-1">
                  [
                  <div
                    className="tooltip"
                    data-tip={!copy ? 'Copy to clipboard' : '✓ Copy'}
                  >
                    <span className="text-orange cursor-pointer">
                      <SliceText text={data.voucherEntity.voucherHash} />
                    </span>
                  </div>
                  ]
                </div>
              </CopyToClipboard>
            </span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="border relative border-gray-300 rounded-lg overflow-hidden">
              <Canvas
                //@ts-ignore
                className="w-full"
                text={`${process.env.NEXT_PUBLIC_BASE_URL}/voucher/pass/${client.patient?.stripePaymentId}`}
                options={{
                  margin: 1,
                  scale: 6,
                  quality: 100,
                  color: {
                    dark: '#000',
                    light: '#FFF',
                  },
                }}
              />
            </div>

            <div className="flex flex-col items-center gap-1">
              <h4 className="text-sm text-center">
                <CurrencyFlag
                  currency={data.currency}
                  className="rounded-full !h-4 !w-4 object-cover"
                />{' '}
                <span className="font-semibold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: data.currency,
                  }).format(data.amount)}
                </span>{' '}
                Pass santé WiiQare <br />
                pour{' '}
                <span className="text-orange font-semibold">
                  {data?.patient?.firstName + ' ' + data?.patient?.lastName ??
                    '' + ' ' + data?.patient?.lastName ??
                    ''}
                </span>
              </h4>
            </div>
          </div>

          <div className="text-center mt-6 flex flex-col gap-2 space-y-3">
            <h4 className="font-semibold text-gray-700 text-sm">
              Envoyer le pass santé au bénéficiaire:
            </h4>
            <div className="flex justify-between">
              <Link
                href={`whatsapp://send?text=${process.env.NEXT_PUBLIC_BASE_URL}/voucher/pass/${client.patient?.stripePaymentId}`}
                legacyBehavior
                target={'_blank'}
              >
                <a className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 mr-2 mb-2">
                  <img src="/images/whatsapp.png" alt="" className="w-6" />
                  <span className="hidden md:flex">WhatsApp</span>
                </a>
              </Link>

              <Link
                href={`https://www.facebook.com/share.php?u=${process.env.NEXT_PUBLIC_BASE_URL}/voucher/pass/${client.patient?.stripePaymentId}`}
                legacyBehavior
                target={'_blank'}
              >
                <a className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 mr-2 mb-2">
                  <img
                    src="/images/facebook-share.png"
                    alt=""
                    className="w-6"
                  />
                  <span className="hidden md:flex">Facebook</span>
                </a>
              </Link>

              <button
                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 mr-2 mb-2"
                onClick={onSubmit}
              >
                <img src="/images/sms.png" alt="" className="w-6" />
                {sendSMSMutation.isLoading ? (
                  <LoadingButton />
                ) : (
                  <span className="hidden md:flex">Message</span>
                )}
              </button>

              <CopyToClipboard
                text={`${process.env.NEXT_PUBLIC_BASE_URL}/voucher/pass/${client.patient?.stripePaymentId}`}
                onCopy={() => {
                  setCopyLink(true);
                  setTimeout(() => {
                    setCopyLink(false);
                  }, 2000);
                }}
              >
                <button
                  type="button"
                  className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 mr-2 mb-2"
                >
                  <img src="/images/text.png" alt="" className="w-6" />
                  <span className="hidden md:flex">
                    {!copyLink ? 'Copier le lien' : 'Copié avec succès'}
                  </span>
                </button>
              </CopyToClipboard>
            </div>
          </div>
        </>
      ) : (
        <div className="relative">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex flex-col items-center select-none">
              <Image
                alt="logo"
                src={logoDark}
                className="h-6 md:h-9 object-left object-contain w-min"
              />
              <h1 className="font-extrabold text-gray-700 text-lg hidden md:flex">
                Pass Sante
              </h1>
            </div>
            <span className="text-xs flex items-center gap-1">
              Pass Sante ID:
              <CopyToClipboard
                text={'0xcda1470a8117daaccf368eb4'}
                onCopy={() => {
                  setCopy(true);
                  setTimeout(() => {
                    setCopy(false);
                  }, 2000);
                }}
              >
                <div className="flex items-center gap-1">
                  [
                  <div
                    className="tooltip"
                    data-tip={!copy ? 'Copy to clipboard' : '✓ Copy'}
                  >
                    <span className="text-orange cursor-pointer">
                      <SliceText text={'0xcda1470a8117daaccf368eb4'} />
                    </span>
                  </div>
                  ]
                </div>
              </CopyToClipboard>
            </span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="border relative border-gray-300 rounded-lg overflow-hidden">
              <Canvas
                //@ts-ignore
                className="w-full"
                text={`${process.env.NEXT_PUBLIC_BASE_URL}/voucher/pass/0xcda1470a8117daaccf368eb4`}
                options={{
                  margin: 1,
                  scale: 6,
                  quality: 100,
                  color: {
                    dark: '#000',
                    light: '#FFF',
                  },
                }}
              />
              {/* <div className="absolute w-full h-full z-20 top-1/3 left-1.5/3 mx-auto">
			<Image
				src={logo}
				className="h-6 md:h-9 object-left object-contain w-min"
			/>
		</div> */}
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="flex -space-x-2">
                <img
                  className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800"
                  src="/images/homme.png"
                  alt="Image Description"
                />
                <img
                  className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800"
                  src="/images/femme.png"
                  alt="Image Description"
                />
              </div>

              <h4 className="text-sm text-center">
                <span className="font-semibold">$ 0.00</span> Health Pass
                WiiQare <br /> From{' '}
                <span className="text-orange font-semibold">
                  <SliceText text={'0xcda1470a8117daaccf368eb4'} />
                </span>{' '}
                To{' '}
                <span className="text-orange font-semibold">
                  <SliceText text={'0xcda1470a8117daaccf368eb4'} />
                </span>
              </h4>
            </div>
          </div>

          <div className="text-center mt-6 flex flex-col gap-2 space-y-3">
            <h4 className="font-semibold text-gray-700 text-sm">
              Envoyer le pass santé au bénéficiaire:
            </h4>
            <div className="flex justify-between">
              <Link
                href={`whatsapp://send?text=${
                  process.env.NEXT_PUBLIC_BASE_URL
                }/voucher/pass/${'0xcda1470a8117daaccf368eb4'}`}
                legacyBehavior
                target={'_blank'}
              >
                <a className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 mr-2 mb-2">
                  <img src="/images/whatsapp.png" alt="" className="w-6" />
                  <span className="hidden md:flex">WhatsApp</span>
                </a>
              </Link>

              <Link
                href={`https://www.facebook.com/share.php?u=${
                  process.env.NEXT_PUBLIC_BASE_URL
                }/voucher/pass/${'0xcda1470a8117daaccf368eb4'}`}
                legacyBehavior
                target={'_blank'}
              >
                <a className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 mr-2 mb-2">
                  <img
                    src="/images/facebook-share.png"
                    alt=""
                    className="w-6"
                  />
                  <span className="hidden md:flex">Facebook</span>
                </a>
              </Link>

              <Link
                href={`sms://+243814978651&?body=${
                  process.env.NEXT_PUBLIC_BASE_URL
                }/voucher/pass/${'0xcda1470a8117daaccf368eb4'}`}
                legacyBehavior
                target={'_blank'}
              >
                <a className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 mr-2 mb-2">
                  <img src="/images/sms.png" alt="" className="w-6" />
                  <span className="hidden md:flex">Message</span>
                </a>
              </Link>

              <CopyToClipboard
                text={`${
                  process.env.NEXT_PUBLIC_BASE_URL
                }/voucher/pass/${'0xcda1470a8117daaccf368eb4'}`}
                onCopy={() => {
                  setCopyLink(true);
                  setTimeout(() => {
                    setCopyLink(false);
                  }, 2000);
                }}
              >
                <button
                  type="button"
                  className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 mr-2 mb-2"
                >
                  <img src="/images/text.png" alt="" className="w-6" />
                  <span className="hidden md:flex">
                    {!copyLink ? 'Copy Link' : 'Successfully Copied'}
                  </span>
                </button>
              </CopyToClipboard>
            </div>
          </div>

          <div className="flex-shrink-0 border-none backdrop-filter backdrop-blur-[6px] w-full h-full bg-white/30 absolute top-0 p-6"></div>

          <div className="flex flex-shrink-0 absolute top-0 justify-center items-center w-full h-full">
            <div className="flex flex-col gap-8 justify-center items-center">
              <HiLockClosed size={150} />
              <button
                onClick={handleView}
                className="bg-orange flex gap-2 effect-up justify-center items-center text-gray-100 font-normal h-fit  py-2 px-3 rounded-lg text-sm transition duration-300"
              >
                {loadView ? (
                  <LoadingButton />
                ) : (
                  <>
                    <HiOutlineEye /> Voir Pass Santé
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Send;
