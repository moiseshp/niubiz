'use client';
 
import classNames from 'classnames/bind';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
 
import { envConfig } from '@/core/models/constants/envConfig.constant';
import { cleanCartState } from '@/features/cart/states/cart.slice';
import { cleanCartErrorState } from '@/features/cart/states/cartError.slice';
import {
  prevCheckoutStep,
  setCompletedPaymentForm,
  setIsProcessingPurchase,
  setOrderId
} from '@/features/checkout/states/checkout.slice';
import { useDispatch, useSelector } from '@/integrations/store';
import { InputCheckbox } from '@/ui/InputCheckbox';
import { InputText } from '@/ui/InputText';
import { LabelForm } from '@/ui/LabelForm';
import { Loader } from '@/ui/Loader';
import { Select } from '@/ui/Select';
import { zodResolver } from '@hookform/resolvers/zod';
 
import useCardFormLoader from '../../hooks/useCardFormLoader';
import useCheckOrderStatus from '../../hooks/useCheckOrderStatus';
import useCompleteCardPayment from '../../hooks/useCompleteCardPayment';
import useNiubizScript from '../../hooks/useNiubizScript';
import useStartPayment from '../../hooks/useStartPayment';
import useTrackEventErrorPaymentInfo from '../../hooks/useTrackEventErrorPaymentInfo';
import useTrackPurchaseEvent from '../../hooks/useTrackPurchaseEvent';
import { EPaymentMethod } from '../../models/enums/payment-methods.enum';
import { cardPaymentFormSchema, TCardPaymentFormFields } from '../../validators/cardPaymentForm.schema';
import styles from './CardPaymentContent.module.scss';
 
const cx = classNames.bind(styles);
interface Props {
  setShowForm: (showForm: boolean) => void;
}
export const CardPaymentContent: FC<Props> = ({ setShowForm }) => {
  const dispatch = useDispatch();
  const { push } = useRouter();
  const [dataTestIdProgress, setDataTestIdProgress] = useState('');
  const { paymentAttempts, isProcessingPurchase, clientInfo, orderId, orderStatusAttempts, acceptDataProcessing } =
    useSelector(state => state.checkout);
 
  const { trackPurchase } = useTrackPurchaseEvent();
  const { trackErrorPaymentInfo } = useTrackEventErrorPaymentInfo();
 
  const {
    register,
    formState: { errors, isValid },
    getValues,
    setValue,
    trigger,
    control,
    reset: resetForm,
    setFocus,
    resetField,
    clearErrors
  } = useForm<TCardPaymentFormFields>({
    mode: 'onTouched',
    resolver: zodResolver(cardPaymentFormSchema),
    defaultValues: {
      emailOption: 'sameEmail',
      email: '',
      installments: 0
    }
  });
 
  const emailOptionWatcher = useWatch({ control, name: 'emailOption' });
  const installmentsWatcher = useWatch({ control, name: 'installments' });
 
  const { loadNiubizScript } = useNiubizScript({
    onLoad: () => startPayment(EPaymentMethod.Card)
  });
 
  const { startPayment, startPaymentData } = useStartPayment({
    onSuccess: data => initCardFormConfig(data)
  });
 
  const { initCardFormConfig, showForm, installmentOptions, cardNumberError, cardExpiryError, cardCvvError } =
    useCardFormLoader({
      onFormLoadComplete: () => resetForm(),
      setTestIdProgress: id => setDataTestIdProgress(id)
    });
 
  const { completeCardPayment } = useCompleteCardPayment({
    onSuccess: () => onCompletePaymentSuccess(),
    onError: message => trackErrorPaymentInfo(message)
  });
 
  const { checkOrderStatus } = useCheckOrderStatus({
    onSuccess: () => onCompletePaymentSuccess(),
    onError: () => dispatch(prevCheckoutStep()),
    setTestIdProgress: id => setDataTestIdProgress(id)
  });
 
  const onCompletePaymentSuccess = () => {
    trackPurchase(startPaymentData?.orderId || '');
    dispatch(setIsProcessingPurchase(true));
    dispatch(cleanCartState());
    dispatch(cleanCartErrorState());
    dispatch(setOrderId({ orderId: startPaymentData?.orderId || '' }));
    push(`/confirmation/${startPaymentData?.orderId}`);
  };
 
  const onFocusEmail = () => clearErrors('email');
 
  const onBlurEmail = () => trigger('email');
 
  const validateAndCompletePayment = async () => {
    const isValid = await trigger();
    const values = getValues();
 
    if (!isValid || isProcessingPurchase) return;
 
    const email = values.emailOption === 'sameEmail' ? clientInfo.email : values.email;
 
    const completeCardPaymentData = {
      cardName: values.cardName,
      cardLastName: values.cardLastName,
      email: email || '',
      installmentsValue: values.installments || 0,
      acceptDataProcessing
    };
 
    completeCardPayment(completeCardPaymentData, startPaymentData);
  };
 
  useEffect(() => {
    if (emailOptionWatcher === 'anotherEmail') {
      setFocus('email');
    }
 
    if (emailOptionWatcher === 'sameEmail') {
      resetField('email');
    }
  }, [emailOptionWatcher]);
 
  useEffect(() => {
    const installementOptions = !installmentOptions.length ? 0 : installmentOptions[0];
 
    setValue('installments', installementOptions);
  }, [installmentOptions]);
 
  useEffect(() => {
    dispatch(setCompletedPaymentForm(isValid));
  }, [isValid]);
 
  useEffect(() => {
    if (paymentAttempts > 0) {
      validateAndCompletePayment();
    }
  }, [paymentAttempts]);
 
  useEffect(() => {
    checkOrderStatus(orderStatusAttempts.attempts, orderId);
  }, [orderStatusAttempts.attempts]);
 
  useEffect(() => {
    const scriptExists = !!document.querySelector(`script[src="${envConfig.niubizScriptUrl}"]`);
 
    scriptExists ? startPayment(EPaymentMethod.Card) : loadNiubizScript();
  }, []);
 
  useEffect(() => {
    setShowForm(showForm);
  }, [showForm]);
 
  return (
    <>
      {!showForm && (
        <div className={cx('card-payment-content')}>
          <Loader>Generando formulario</Loader>
        </div>
      )}
 
      <form
        role='form'
        className={cx('card-payment-content', { 'card-payment-content--hidden': !showForm })}
        data-testid={dataTestIdProgress}
      >
        <LabelForm htmlFor='number-card' error={cardNumberError}>
          <div className={cx('card-payment-content__input')}>
            <div id='number-card' data-testid='number-card' className={cx('card-payment-content__form-control')}></div>
          </div>
        </LabelForm>
 
        <LabelForm htmlFor='cardName' error={errors.cardName?.message}>
          <InputText
            aria-label='Nombre (Como figura en la tarjeta)'
            fullWidth
            className={cx('custom-input-text', 'card-payment-content__custom-input')}
            maxLength={45}
            {...register('cardName')}
            hasError={!!errors.cardName?.message}
            placeholder='Nombre'
          />
        </LabelForm>
 
        <LabelForm htmlFor='cardLastName' error={errors.cardLastName?.message}>
          <InputText
            fullWidth
            aria-label='Apellido (Como figura en la tarjeta)'
            className={cx('custom-input-text', 'card-payment-content__custom-input')}
            hasError={!!errors.cardLastName?.message}
            maxLength={45}
            placeholder='Apellido'
            {...register('cardLastName')}
          />
        </LabelForm>
 
        <div className={cx('card-payment-content__row')}>
          <LabelForm htmlFor='expiry-date' error={cardExpiryError} className={cx('card-payment-content__label')}>
            <div className={cx('card-payment-content__input')}>
              <div
                id='expiry-date'
                data-testid='expiry-date'
                className={cx('card-payment-content__form-control')}
              ></div>
            </div>
          </LabelForm>
 
          <LabelForm htmlFor='security-code' error={cardCvvError} className={cx('card-payment-content__label')}>
            <div className={cx('card-payment-content__input')}>
              <div
                id='security-code'
                data-testid='security-code'
                className={cx('card-payment-content__form-control')}
              ></div>
            </div>
          </LabelForm>
        </div>
 
        {!!installmentOptions.length && (
          <LabelForm htmlFor='installments'>
            <Select
              {...register('installments')}
              onChange={(item: any) => {
                setValue('installments', item?.value);
              }}
              value={{
                value: installmentsWatcher,
                label: installmentsWatcher === 0 ? 'Sin cuotas' : installmentsWatcher
              }}
              options={installmentOptions.map((item: any) => ({
                value: item,
                label: item === 0 ? 'Sin cuotas' : item
              }))}
              placeholder='Selecciona un número de cuota(s)'
              menuPortalTarget={document.querySelector('body')}
            />
          </LabelForm>
        )}
 
        <div className={cx('card-payment-content__email-options')}>
          <span className={cx('card-payment-content__email-title')}>Correo electrónico</span>
 
          <InputCheckbox
            checked={emailOptionWatcher === 'sameEmail'}
            id='receiptEmail1'
            type='radio'
            value={'sameEmail'}
            align='center'
            text={<span className={cx('card-payment-content__email-option')}>Usar el mismo correo de la boleta</span>}
            {...register('emailOption')}
          />
 
          <InputCheckbox
            checked={emailOptionWatcher === 'anotherEmail'}
            id='receiptEmail2'
            type='radio'
            align='center'
            value={'anotherEmail'}
            text={<span className={cx('card-payment-content__email-option')}>Ingresar otro correo</span>}
            {...register('emailOption')}
          />
        </div>
 
        {emailOptionWatcher === 'anotherEmail' && (
          <LabelForm htmlFor='email' error={errors.email?.message}>
            <InputText
              fullWidth
              label='Correo'
              aria-label='Correo'
              maxLength={50}
              {...register('email')}
              onFocus={onFocusEmail}
              onBlur={onBlurEmail}
              hasError={!!errors.email?.message}
            />
          </LabelForm>
        )}
      </form>
    </>
  );
};