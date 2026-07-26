// Global testoppsett. @testing-library/react-native v14 registrerer egne
// matchers automatisk når biblioteket importeres i en testfil, så her holder
// vi det bevisst tomt. Bruk spørringene som render() returnerer (ikke det
// globale `screen`), som er robust mot dobbel-lasting av biblioteket.
export {};
