import { createContext, useContext, useState, type ReactNode } from 'react';
import { Snackbar, Alert, type AlertColor, CircularProgress, Box } from '@mui/material';

type Notification = {
    message: string;
    severity: AlertColor;
    persist?: boolean;
    loading?: boolean;
};

type NotificationContextType = {
    notify: (message: string, severity: AlertColor, persist?: boolean) => void;
    notifySuccess: (msg: string) => void;
    notifyError: (msg: string) => void;
    notifyInfo: (msg: string) => void;
    notifyWarning: (msg: string) => void;
    notifyLoading: (msg?: string) => void;
    closeNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [notification, setNotification] = useState<Notification>({
        message: '',
        severity: 'info',
    });

    const notify = (message: string, severity: AlertColor, persist = false) => {
        setNotification({ message, severity, persist });
        setOpen(true);
    };

    const notifyLoading = (msg = 'Loading...') => {
        setNotification({ message: msg, severity: 'info', persist: true, loading: true });
        setOpen(true);
    };

    const closeNotification = () => setOpen(false);

    const value: NotificationContextType = {
        notify,
        notifySuccess: (msg: string) => notify(msg, 'success'),
        notifyError: (msg: string) => notify(msg, 'error'),
        notifyInfo: (msg: string) => notify(msg, 'info'),
        notifyWarning: (msg: string) => notify(msg, 'warning'),
        notifyLoading,
        closeNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={notification.persist ? null : 3000}
                onClose={closeNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                {notification.loading ? (
                    <Alert
                        onClose={closeNotification}
                        severity="info"
                        icon={
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                <CircularProgress color="inherit" size={16} />
                            </Box>
                        }
                        sx={{ width: '100%' }}
                    >
                        {notification.message}
                    </Alert>
                ) : (
                    <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: '100%' }}>
                        {notification.message}
                    </Alert>
                )}
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export const useNotify = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotify must be used within a NotificationProvider');
    }
    return context;
};
