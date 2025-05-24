import {NotificationProvider} from "./hooks/NotificationProvider.tsx";
import Notes from './Notes.tsx'

function App() {
    return (
        <NotificationProvider>
            <Notes />
        </NotificationProvider>
    )
}

export default App;