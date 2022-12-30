import Layout from '../components/Layout'

export default function Home({pokemons}) {
    return (
        <>
            <Layout title = "Pokedex">
                <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center" >
                    <h1 className="fw-bold display-3 text-white mb-4">Welcome to the Pokedex!</h1>
                    <a className="btn btn-lg btn-warning fw-bold">Show Random Pokemon</a>
                </div>
            </Layout>
        </>
    )
}
