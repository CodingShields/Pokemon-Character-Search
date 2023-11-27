import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import pokeBackground from "./assets/pokeBackground.jpg";
function App() {
	const [pokeData, setPokeData] = useState([]);
	const [userSearch, setUserSearch] = useState("");
	const [multipleNames, setMultipleNames] = useState([
		{
			id: 0,
			name: "Please Select A Pokemon",
			url: "",
		},
	]);
	const [userSearchResponse, setUserSearchResponse] = useState([]);
	const [state, setState] = useState({
		loading: false,
		error: false,
		errorMessage: "",
		searchedDataSingleMatch: false,
		searchedDataMultipleMatch: false,
		statsModal: false,
		clearStats: false,
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
		setUserSearch(formatText);
		const searchData = pokeData.filter((item) => item.name === formatText);
		console.log(searchData, "searchData");
		if (searchData.length === 0) {
			const wideDataSearch = pokeData.filter((item) => item.name.startsWith(formatText));
			console.log(wideDataSearch, "wideDataSearch");
			wideDataSearch.forEach((pokemon) => {
				setMultipleNames((prevNames) => [
					...prevNames,
					{
						id: nanoid(),
						name: pokemon.name,
						url: pokemon.url,
					},
				]);
			});
			console.log(multipleNames, "multipleNames");
			setState({ searchedDataMultipleMatch: true });
		} else {
			const characterUrl = searchData[0].url;
			console.log(characterUrl, "characterUrl");
			const displayText = characterName.charAt(0).toUpperCase() + characterName.slice(1);
			const fetchSprite = async () => {
				try {
					const response = await fetch(`${characterUrl}`);
					if (!response.ok) {
						throw new Error("Something went wrong");
					} else if (response.ok) {
						const characterData = await response.json();
						console.log(characterData, "characterData");
						setUserSearchResponse((prevState) => [
							...prevState,
							{
								id: nanoid(),
								name: displayText,
								img: characterData.sprites.front_default,
								weight: characterData.weight,
								height: characterData.height,
							},
						]);
						setState({ searchedDataSingleMatch: true });
						setUserSearch("");
					}
				} catch (error) {
					console.log(error, "error");
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
		setUserSearch(characterName);
		setState({ searchedDataMultipleMatch: false });
	};

	const handleStats = (id) => {
		console.log(id, "clicked item");
		setState({ statsModal: true });
	};

	const handleClearStats = () => {
		setState({ clearStats: true });
	};

	return (
		<div>
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
				<div
					style={{
						display: state.statsModal ? "flex" : "none",
					}}
					className='modal'
				>
					<div className='modal-content'>
						<h1>Stats</h1>

						<button className='close-button' onClick={() => setState({ statsModal: false })}>
							x
						</button>
					</div>
				</div>
				<img className='background' src={pokeBackground} />
				<div className='poke-container-main'>
					<input
						value={userSearch}
						onChange={(e) => setUserSearch(e.target.value)}
						className='poke-search-input'
					></input>
					<button className='poke-search-button' onClick={handleSearch}>
						Search Pokemon
					</button>
					<button className='poke-search-button' onClick={handleClearStats}>
						Clear Pokemon
					</button>
					{state.searchedDataSingleMatch
						? userSearchResponse.map((item) => {
								return (
									<div key={item.id} className='user-search-poke-container'>
										<div className='poke-character-name-container'>
											<h3 className='poke-character-name-text'>{item.name}</h3>
											<p onClick={() => handleStats(item.id)} className='poke-stats-button'>
												Stats Here
											</p>
										</div>
										<div className='poke-character-img-container'>
											<img className='poke-character-img' src={item.img} />
										</div>
										<button className='poke-delete-button' onClick={() => handlePokeCharacterDelete(item.id)}>
											x
										</button>
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
						<select className='pokemon-multiple-names-select' onChange={handleCharacterSelect}>
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
