export const PhoneModal = ({ onClose }) => {
    return (
        <ModalLayout title="Changing the phone number" onClose={onClose} onSave={() => console.log('Phone Saved')}>
            <input type="tel" className={styles.modalInput} placeholder="+7 (___) ___-__-__" />
        </ModalLayout>
    );
};