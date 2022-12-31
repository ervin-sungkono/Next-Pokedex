import Layout from "../../components/Layout"
import Link from "next/link"

export default function PokemonDetail({pokemon, species, evolutions}){
    return(
        <Layout title={pokemon.name.split('-').map((name) => name[0].toUpperCase() + name.substring(1)).join(' ')}>
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
                            </h2>
                            <p className="card-text"><b>Habitat: </b>{species.habitat.name.split('-').map((name) => name[0].toUpperCase() + name.substring(1)).join(' ')}</p>
                            <p className="card-text text-muted">{species.flavor_text_entries[0].flavor_text.replace('\f',' ')}</p>
                            <div className="card bg-warning">
                                <div className="card-header fw-bold">Base Stats</div>
                                <div className="card-body">
                                    <div className="row row-cols-2">
                                        {pokemon.stats.map((stat) => (
                                            <div className="col">
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
                    {evolutions.map((evolution) => (
                        <div className="col-md-4 mb-3">
                            <Link href={`/pokemon/${evolution.name}`}>
                                <div class="card poke-card">
                                <img src={evolution.image} class="card-img-top" alt="..."/>
                                <div class="card-body">
                                    <h4 class="card-title text-dark text-center fw-bold">{evolution.name.split('-').map((name) => name[0].toUpperCase() + name.substring(1)).join(' ')}</h4>
                                </div>
                                </div>
                            </Link>
                        </div> 
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export async function getStaticPaths(){
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1154")
    const {results} = await res.json()
    const paths = results.map(result => {
        return{
            params:{
                name : result.name
            }
        }
    })

    return{
        paths : paths,
        fallback : false
    }
}

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

export async function getStaticProps(context){
    const name = context.params.name
    const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json())
    const species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`).then(res => res.json())
    const {chain} = await fetch(species.evolution_chain.url).then(res => res.json())

    const evolutionsList = getEvolutionsList(chain)
    const evolutions = await Promise.all(evolutionsList.map(async(evolution) => {
        const {id} = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolution.name}`).then(res => res.json())
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        return{
            name : evolution.name,
            image : imageUrl,
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