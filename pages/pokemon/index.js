import Link from "next/link"
import { useState } from "react"
import Layout from "../../components/Layout"
import Pagination from "../../components/Pagination"
import PokemonCard from "../../components/PokemonCard"
import { paginate } from "../../helpers/paginate"

export default function PokemonPage({pokemons}){
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 48

    const pagesCount = Math.ceil(pokemons.length / pageSize);

    const paginatedPokemons = paginate(pokemons, currentPage, pageSize)

    const onPageChange = (page) => {
        setCurrentPage(page)
    }
    return (
        <>
            <Layout title = "Pokemon List">
                <div className="container">
                    <h1 className="text-center text-white mb-4">All Pokemon List</h1>
                    <div className="d-flex flex-wrap justify-content-center gap-4">
                        {paginatedPokemons.map((pokemon, index) => (
                            <Link href={"pokemon/" + pokemon.name}>
                                <div class="card shadow rounded" style={{width:"clamp(15rem, 60vw, 18rem)"}} key={index}>
                                    <PokemonCard pokemon = {pokemon}/>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Pagination
                        pagesCount={pagesCount}
                        currentPage={currentPage}
                        onPageChange={onPageChange}
                    />
                </div>  
            </Layout>
        </>
    )
}

async function getPokemonList(){
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100")
    const {results} = await res.json()
    return results
}

async function getPokemons(results){
    const pokemons = await Promise.all(results.map(async(result) => {
            const {id, name, types, sprites} = await fetch(result.url).then(res => res.json())
            return {
                id : id,
                name : name,
                types : types,
                sprites : sprites
            }
        }))
    return pokemons
}

export async function getStaticProps(){
    const pokemons = await getPokemonList().then(results => getPokemons(results))
    return {
      props: {pokemons : pokemons}
    }
}