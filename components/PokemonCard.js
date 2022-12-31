
export default function PokemonCard({pokemon}){
    return(
        <>
            <img src={pokemon.sprites.other["official-artwork"].front_default} class="card-img-top bg-secondary" alt="..."/>
            <div class="card-body d-flex flex-column align-items-center">
                <h5 class="card-title fw-bold text-dark">{pokemon.name.split('-').map((name) => name[0].toUpperCase() + name.substring(1)).join(' ')}</h5>
                <p className="card-text text-muted">{`#${Math.floor(pokemon.id/100)}${Math.floor(pokemon.id/10 % 10)}${pokemon.id%10}`}</p>
                <div className="d-flex gap-2">
                    {pokemon.types.map((type) => (
                        <span class={`badge type-${type.type.name} px-3 py-2`}>{type.type.name[0].toUpperCase() + type.type.name.substring(1)}</span>
                    ))}
                </div>
            </div>
        </>
    )
}