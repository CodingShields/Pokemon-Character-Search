import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import pokeBackground from "./assets/pokeBackground.jpg";
function App() {
	const [pokeData, setPokeData] = useState([]);
	const [userSearch, setUserSearch] = useState("");
	const [multipleNames, setMultipleNames] = useState([]);
	const [userSearchResponse, setUserSearchResponse] = useState([]);
	const [state, setState] = useState({
		loading: false,
		error: false,
		errorMessage: "",
		searchedDataSingleMatch: false,
		searchedDataMultipleMatch: false,
	});

	useEffect(() => {
		setState({ loading: true });
		setState({ searchedData: false });
		const fetchPokemon = async () => {
			try {
				const response = await fetch(" https://pokeapi.co/api/v2/pokemon/?limit=1292 ");
				if (!response.ok) {
					throw new Error("Something went wrong");
				} else if (response.ok) {
					const allPokemon = await response.json();

					setPokeData(allPokemon.results);
					console.log(pokeData, "pokeData");
					setState({ loading: false });
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchPokemon();
	}, []);

	const handleSearch = () => {
		const characterName = userSearch;
		const formatText = characterName.charAt(0).toLowerCase() + characterName.slice(1);
		setUserSearch(formatText)
		const result = pokeData.filter((item) => item.name.startsWith(formatText));
		if (result.length === 0) {
		} else if (result.length > 0) {
				result.forEach((pokemon) => {
				setMultipleNames((prevState) => [
					...prevState,
					{
						id: nanoid(),
						name: pokemon.name,
						url: pokemon.url,
					},
				]);
			});
			setState({ searchedDataMultipleMatch: true });
		} else {
			const characterUrl = result.url;
			const displayText = characterName.charAt(0).toUpperCase() + characterName.slice(1);
			const fetchSprite = async () => {
				try {
					const response = await fetch(`${characterUrl}`);
					if (!response.ok) {
						throw new Error("Something went wrong");
					} else if (response.ok) {
						const characterData = await response.json();
							setMultipleNames((prevState) => [
							...prevState,
							{
								id: nanoid(),
								name: pokemon.name,
								url: pokemon.url,
							},
							]);
						setState({ searchedDataSingleMatch: true });
						setUserSearch("");
						console.log(userSearchResponse, "userSearchResponse");
					}
				} catch (error) {
					console.log(error);
				}
			};
			fetchSprite();
		}
	};

	const handlePokeCharacterDelete = (id) => {
		const newPokeCharacterList = userSearchResponse.filter((item) => item.id !== id);
		setUserSearchResponse(newPokeCharacterList);
	};


	const handleCharacterSelect = (e) => {
		const characterId = e.target.value;
		const findCharacter = multipleNames.find((item) => item.id === characterId);
		const characterName = findCharacter.name;
		const characterUrl = findCharacter.url;
		setState({ searchedDataMultipleMatch: false });
	}

	return (
		<div className='main'>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					marginTop: "150px",
				}}
				className='pokemon-container'
			>
				<img className='background' src={pokeBackground} />
				<div className='poke-container-main'>
					<input
						value={userSearch}
						onChange={(e) => setUserSearch(e.target.value)}
						className='poke-search-input'
					></input>
					<button onClick={handleSearch}>Search Pokemon</button>

					{state.searchedDataSingleMatch
						? userSearchResponse.map((item) => {
								return (
									<div key={item.id} className='user-search-poke-container'>
										<h3 className='poke-character-name-text'>{item.name}</h3>
										<button>Stats Here</button>
										<img className='poke-character-img' src={item.img} />
										<button onClick={() => handlePokeCharacterDelete(item.id)}>X</button>
									</div>
								);
						  })
						: ""}

					<div
						style={{
							display: state.searchedDataMultipleMatch ? "flex" : "none",
						}}
						className='multiple-names-container'
					>
						<select
						onChange = {handleCharacterSelect}
						>
							{multipleNames.map((item) => {
								return (
									<option key={item.id} value={item.id}>
										{item.name}
									</option>
								);
							})}
						</select>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
