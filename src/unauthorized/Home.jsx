import { Link } from 'react-router-dom';

function Home(){
    return(
    <div className="min-h-screen w-screen bg-gray-100 flex flex-col">
        <main className='flex-grow flex items-center justify-center flex-col'>
            <h1 className="text-3xl font-bold text-primary mb-4">Study Planner</h1>
            <Link to="/login">
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
                Start Planning
                </button>
            </Link>
        </main>   
        <footer className='text-center text-gray-700 pb-4'>
            @Qamarul Anuar
        </footer>
    </div>
    );
}

export default Home