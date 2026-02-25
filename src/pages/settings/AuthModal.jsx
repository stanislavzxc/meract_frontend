export const AuthModal = ({ onClose }) => {
    return (
        <ModalLayout title="Google Authenticator" onClose={onClose} onSave={() => console.log('Auth Linked')}>
            <p style={{color: '#888', fontSize: '14px', textAlign: 'center'}}>
                Scan the QR-code in your Google Authenticator app to connect.
            </p>
            {/* Здесь обычно место под QR-код */}
            <div style={{background: 'white', width: '150px', height: '150px', margin: '10px auto'}}></div>
        </ModalLayout>
    );
};