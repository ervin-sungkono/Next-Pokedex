import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import Layout from "../../components/Layout"
import Pagination from "../../components/Pagination"
import PokemonCard from "../../components/PokemonCard"
import { paginate } from "../../helpers/paginate"

const PAGE_SIZE = 48
const ITEM_COUNT = 905
const PAGES_COUNT = Math.ceil(ITEM_COUNT / PAGE_SIZE);

export default function PokemonPage({pokemons}){
    const [currentPage , setPage] = useState(1)
    const onPageChange = (page) => {
        setPage(page)
    }

    const filteredPokemons = paginate(pokemons, currentPage, PAGE_SIZE)
    
    return (
        <>
            <Layout title = "Pokemon List">
                <div className="container min-vh-100 d-flex flex-column">
                    <h1 className="text-center text-white mb-4">All Pokemon List</h1>
                    <div className="d-flex flex-wrap justify-content-center gap-4 flex-grow-1">
                        {filteredPokemons.map((pokemon, index) => (
                            <Link href={"pokemon/" + pokemon.name} key={index}>
                                <div class="card poke-card shadow rounded" style={{width:"clamp(15rem, 60vw, 18rem)"}}>
                                    <PokemonCard pokemon = {pokemon}/>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Pagination
                        pagesCount={PAGES_COUNT}
                        currentPage={currentPage}
                        onPageChange={onPageChange}
                    />
                </div>  
            </Layout>
        </>
    )
}

async function getAllPokemons(){
    const finalResults = []
    for(let i = 0; i < PAGES_COUNT; i++){
        const promises = []
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${i * PAGE_SIZE}`)
        const {results} = await res.json()
        results.forEach((result) => {
            promises.push(fetch(result.url).then(res => res.json()))
        })
        const pokemons = await Promise.all(promises)
        .then(pokemons => pokemons.map(pokemon => {
            return{
                id : pokemon.id,
                name : pokemon.name,
                sprites : pokemon.sprites,
                types : pokemon.types
            }
        }))
        pokemons.forEach(pokemon => finalResults.push(pokemon))
    }
    return finalResults
}

// export async function getServerSideProps({query}){
//     const page = query?.page || 1
//     const pokemons = await getPokemonList(PAGE_SIZE, page).then(results => getPokemons(results))
    
//     if(!pokemons)
//     return{
//         notFound : true
//     }

//     return {
//         props: {
//             pokemons : pokemons,
//             page : parseInt(page)
//         }
//     }
// }

export async function getStaticProps(){
    const pokemons = await getAllPokemons()
    
    if(!pokemons)
    return{
        notFound : true
    }

    return {
        props: {
            pokemons : pokemons
        }
    }
}