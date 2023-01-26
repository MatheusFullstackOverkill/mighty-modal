import React, { useEffect, useState } from 'react';
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
  onConfirm?: Function,
  onCancel?: Function,
  customModal?: boolean,
  children: JSX.Element | JSX.Element[]
}

export const Modal = ({
  type,
  opened,
  customClass,
  allowOutsideClick,
  hideCloseIcon,
  onClose,
  onConfirm,
  onCancel,
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
                {!hideCloseIcon && 
                <CloseIconSvg 
                className='close-btn'
                onClick={() => onClose && onClose()}/>}
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

export const ModalWrapper = ({children}: any) => {
  const[showModal, toggleModal] = useState(false);
  const[showConfirmationModal, toggleConfirmationModal] = useState(false);
  const[showResultModal, toggleResultModal] = useState(false);

  const confirmationModalListener = async () => {
    return new Promise((resolve, reject) => {
      toggleConfirmationModal(true);
      setTimeout(() => {
        const confirmationBtn = document.querySelector('.confirm') as HTMLButtonElement;
        confirmationBtn.addEventListener('click', () => confirmationModalEvent(true, resolve));
        const rejectBtn = document.querySelector('.reject') as HTMLButtonElement;
        rejectBtn?.addEventListener('click', () => confirmationModalEvent(false, resolve));
      }, 500);
    });
  };

  const confirmationModalEvent = (resultType: boolean, resolve: any) => {
    toggleConfirmationModal(false);
    toggleResultModal(true);
    setTimeout(() => {
      const closeBtns = document.querySelectorAll('.close-btn');
      Array.from(closeBtns).map(closeBtn => 
      closeBtn?.addEventListener('click', () => {
        toggleResultModal(false);
        resolve(resultType);
      }));
    }, 500);
  };
  
  return (
    <>
      {React.cloneElement(children, { confirmationModalListener })}
      <Modal 
      customClass='confirmation-modal'
      opened={showConfirmationModal}
      onClose={() => toggleConfirmationModal(false)}>
        <div>Tem certeza?</div>
        <button className='confirm'>Confirm</button>
        <button className='reject'>Reject</button>
      </Modal>
      <Modal 
      customClass='result-modal'
      opened={showResultModal}
      type={'success'}>
        <div>Já é, brother!</div>
        <button className='close-btn'>Close</button>
      </Modal>
    </>
  )
}

export const Content = (props: any) => {

  useEffect(() => {
    console.log(props);
  }, [])
  

  return (
    <div>
       <button onClick={async () => {
          const response = await props.confirmationModalListener();
          console.log(response);
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