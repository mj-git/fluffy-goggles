import "./App.css";
import { useGetPeopleQuery } from "./features/people/peopleApi";

function App() {
    const { data, isLoading } = useGetPeopleQuery();
    if (isLoading) return;
    return (
        <div className="App">
            <header className="App-header">
                <p>
                    {data.map(({ name }) => (
                        <h1>{name}</h1>
                    ))}
                </p>
            </header>
        </div>
    );
}

export default App;
