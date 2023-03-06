import debounce from 'lodash.debounce';

import Notiflix from 'notiflix';

import { fetchCountries } from './fetchCountries';

import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const countriesRef = document.querySelector('.country-list');
const countryRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const value = event.target.value.trim();

  if (!value) {
    countriesRef.innerHTML = '';
    countryRef.innerHTML = '';
    return;
  }
  fetchCountries(value)
    .then(countries => {
      countriesRef.innerHTML = '';
      countryRef.innerHTML = '';

      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (countries.length > 1) {
        renderCountriesList(countries);
        return;
      }
      if (countries.length === 1) {
        renderCountryinfo(countries);
        return;
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');

      console.log(error.message);
    });
}

function renderCountryinfo(params) {
  const markup = params
    .map(
      country =>
        `<li><img width="60" height="40" alt="${country.name.official}" src="${
          country.flags.svg
        }"><h2>${country.name.official}</h2><p>Capital: ${
          country.capital
        }</p><p>Population: ${
          country.population
        }</p><p>Languages:${Object.values(country.languages).join(
          ', '
        )}</p></li>`
    )
    .join('');
  countryRef.innerHTML = markup;
}

function renderCountriesList(params) {
  const markup = params
    .map(
      country =>
        `<img width="60" height="40" alt="${country.name.official}" src="${country.flags.svg}"><h2>${country.name.official}</h2>`
    )
    .join('');
  countriesRef.innerHTML = markup;
}
