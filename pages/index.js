import { useRouter } from 'next/router'
import Layout from '../components/Layout'

export default function Home({pokemons}) {
    const router = useRouter()

    function showRandomPokemon(){
        const idx = Math.floor(Math.random() * pokemons.length)
        router.push(`/pokemon/${pokemons[idx].name}`)
    }
    return (
        <>
            <Layout title = "Pokedex">
                <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center" >
                    <h1 className="fw-bold display-3 text-white mb-4">Welcome to the Pokedex!</h1>
                    <a className="btn btn-lg btn-warning fw-bold" onClick={() => showRandomPokemon()}>Show Random Pokemon</a>
                </div>
            </Layout>
        </>
    )
}

export async function getStaticProps(){
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200")
    const {results} = await res.json()

    return{
        props: {pokemons : results}
    }
}
