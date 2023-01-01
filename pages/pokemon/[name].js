import Layout from "../../components/Layout"
import Link from "next/link"

export default function PokemonDetail({pokemon, species, evolutions}){
    return(
        <Layout title={`Pokedex | ${pokemon.name.split('-').map((name) => name[0].toUpperCase() + name.substring(1)).join(' ')}`}>
            <div className="container min-vh-100">
                <div className="row row-cols-md-2 mt-4 mb-4 justify-content-center gap-4 m-auto">
                    <div className="col-md-4">
                        <img src={pokemon.sprites.other["official-artwork"].front_default} className="img-fluid"/>
                    </div>
                    <div className="card col-md-6 shadow rounded">
                        <div className="card-body">
                            <h2 className="card-title">
                                <b>{pokemon.name.split('-').map((name) => name[0].toUpperCase() + name.substring(1)).join(' ')}</b>
                                <span className="text-muted ms-2 fs-4">{`#${Math.floor(pokemon.id/100)}${Math.floor(pokemon.id/10 % 10)}${pokemon.id%10}`}</span>
                                <span><img src={pokemon.sprites.front_default} style={{width : 64, height : 64}}/></span>
                            </h2>
                            <p className="card-text"><b>Habitat: </b>{species?.habitat?.name.split('-').map((name) => name[0].toUpperCase() + name.substring(1)).join(' ') || "NaN"}</p>
                            <p className="card-text text-muted">{species?.flavor_text_entries[0].flavor_text.replace('\f',' ') || "No description available"}</p>
                            <div className="card bg-warning">
                                <div className="card-header fw-bold">Base Stats</div>
                                <div className="card-body">
                                    <div className="row row-cols-2">
                                        {pokemon.stats.map((stat, index) => (
                                            <div className="col" key={index}>
                                                <p className="fw-semibold mb-2">{stat.stat.name.split('-').map((name) => name[0].toUpperCase() + name.substring(1)).join(' ')}</p>
                                                <p>{stat.base_stat}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <h2 className="text-white fw-bold mb-3">Evolutions</h2>
                    {evolutions.length > 0 ?
                        evolutions.map((evolution, index) => (
                            <div className="col-md-4 mb-3" key={index}>
                                <Link href={`/pokemon/${evolution?.name}`}>
                                    <div class="card poke-card">
                                    <img src={evolution?.image} class="card-img-top" alt="..."/>
                                    <div class="card-body">
                                        <h4 class="card-title text-dark text-center fw-bold">{evolution?.name.split('-').map((name) => name[0].toUpperCase() + name.substring(1)).join(' ')}</h4>
                                        <p className="text-muted ms-2 fs-5 text-center">{`#${Math.floor(evolution?.id/100)}${Math.floor(evolution?.id/10 % 10)}${evolution?.id%10}`}</p>
                                    </div>
                                    </div>
                                </Link>
                            </div> 
                        ))
                        :
                        <h4 className="text-white mb-3">No Evolutions Available</h4>
                    }
                </div>
            </div>
        </Layout>
    )
}

// export async function getStaticPaths(){
//     const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=905")
//     const {results} = await res.json()
//     const paths = results.map(result => {
//         return{
//             params:{
//                 name : `${result.name}`
//             }
//         }
//     })

//     return{
//         paths : paths,
//         fallback : false
//     }
// }

function getEvolutionsList(chain){
    const reducedChain = []
    let temp = chain

    while(temp.evolves_to.length > 0){
        reducedChain.push(temp.species)
        temp = temp.evolves_to[0]
    }
    reducedChain.push(temp.species)
    
    return reducedChain
}

export async function getServerSideProps({params}){
    const name = params.name
    const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => (res.ok) ? res.json() : null)
    if(!pokemon) return{
        notFound: true
    }
    const species = (pokemon.species?.url != undefined) ? await fetch(pokemon.species.url).then(res => res.json()) : null
    const {chain} = (species.evolution_chain?.url != undefined) ? await fetch(species.evolution_chain.url).then(res => res.json()) : {chain : null}

    const evolutionsList = (chain != null) ? getEvolutionsList(chain) : []
    const evolutions = await Promise.all(evolutionsList.map(async(evolution) => {
        const {id, sprites} = (evolution.name != undefined) ? await fetch(`https://pokeapi.co/api/v2/pokemon/${evolution.name}`).then(res => res.json()) : null
        return{
            id : id,
            name : evolution.name,
            image : sprites.other["official-artwork"].front_default,
        }
    }))
    return {
        props : {
            pokemon : pokemon,
            species : species,
            evolutions : evolutions
        }
    }
}