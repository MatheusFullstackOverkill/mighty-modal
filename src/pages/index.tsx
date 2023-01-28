import React, { useContext, useEffect, useState } from 'react';
import CloseIconSvg from '../../public/close-icon.svg';
import SuccessIconSvg from '../../public/success-icon.svg';
import ErrorIconSvg from '../../public/error-icon.svg';

interface ModalProps {
  type?: 'success' | 'error',
  opened?: boolean,
  customClass?: string,
  allowOutsideClick?: boolean,
  hideCloseIcon?: boolean,
  onClose?: Function,
  customModal?: boolean,
  children: JSX.Element | JSX.Element[]
}

interface ConfirmationModalProps {
  body: string | JSX.Element,
  confirmText: string,
  rejectText: string
}

interface ResultModalProps {
  body: string | JSX.Element,
  type: 'success' | 'error'
}

interface ModalContextProps {
  confirmationModalListener: Function,
  setResultModalProps: React.Dispatch<ResultModalProps>
}

export const Modal = ({
  type,
  opened,
  customClass,
  allowOutsideClick,
  hideCloseIcon,
  onClose,
  customModal,
  children
}: ModalProps) => {
  return opened ?
          <div className={`modal-container ${customClass ? customClass : ''}`}
          onClick={e => {
            allowOutsideClick && 
            (e.target as HTMLElement).className === 'modal-container' &&
            onClose &&
            onClose()
          }}>
            {!customModal ? 
            <div className='default-modal'>
              <div className='default-modal-header'>
                {!hideCloseIcon && onClose &&
                <CloseIconSvg 
                className='close-btn'
                onClick={() => onClose()}/>}
              </div>
              {type && 
              <div className='icon-container'>
                {type === 'success' ? <SuccessIconSvg className='result-icon'/> : <ErrorIconSvg className='result-icon'/>}
              </div>}
              {children}
            </div> : 
            children}
          </div> : 
          <></>
}

const ModalContext = React.createContext<ModalContextProps>({
  confirmationModalListener: () => {},
  setResultModalProps: () => {}
});

export const ModalWrapper = ({children}: any) => {
  const[confirmationModalProps, setConfirmationModalProps] = useState<ConfirmationModalProps | any>(null);
  const[resultModalProps, setResultModalProps] = useState<ResultModalProps | any>(null);

  const confirmationModalListener = async (confirmationModalProps: any) => {
    return new Promise((resolve, reject) => {
      setConfirmationModalProps(confirmationModalProps);
      setTimeout(() => {
        const confirmationBtn = document.querySelector('.confirm') as HTMLButtonElement;
        confirmationBtn.addEventListener('click', () => confirmationModalEvent(true, resolve));
        const rejectBtn = document.querySelector('.reject') as HTMLButtonElement;
        rejectBtn?.addEventListener('click', () => confirmationModalEvent(false, resolve));
      }, 500);
    });
  };

  const confirmationModalEvent = (resultType: boolean, resolve: any) => {
    setConfirmationModalProps(false);
    resolve(resultType);
  };
  
  return (
    <>
      <ModalContext.Provider value={{ confirmationModalListener, setResultModalProps }}>
        {children}
      </ModalContext.Provider>
      <Modal 
      customClass='confirmation-modal'
      opened={confirmationModalProps}
      onClose={() => setConfirmationModalProps(null)}>
        <div>{typeof confirmationModalProps?.body === 'function' ? confirmationModalProps?.body() : confirmationModalProps?.body }</div>
        <button className='confirm'>{confirmationModalProps?.confirmText}</button>
        <button className='reject'>{confirmationModalProps?.rejectText}</button>
      </Modal>
      <Modal 
      customClass='result-modal'
      opened={resultModalProps}
      type={resultModalProps?.type}>
        <div>{typeof resultModalProps?.body === 'function' ? resultModalProps?.body() : resultModalProps?.body }</div>
        <button 
        className='close-btn'
        onClick={() => setResultModalProps(null)}>OK</button>
      </Modal>
    </>
  )
}

export const Content = () => {
  const { confirmationModalListener, setResultModalProps } = useContext(ModalContext);

  return (
    <div>
       <button onClick={async () => {
          const response = await confirmationModalListener({
            body: <p>Eae? Qual vai ser, mermão?</p>,
            confirmText: 'Aceitar',
            rejectText: 'Recusar',
          });
          setResultModalProps({
            type: response ? 'success' : 'error',
            body: <p>Já é, brother!</p>
          });
       }}>DELETE</button>
    </div>
  )
}

export default function Index() {
  return (
    <ModalWrapper>
      <Content/>
    </ModalWrapper>
  )
}