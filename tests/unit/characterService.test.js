const axios = require('axios');
const { expect } = require('chai');
const sinon = require('sinon');
const { searchCharacters } = require('../../services/characterService.js');

describe('Character Search Service', () => {
    let axiosStub;

    beforeEach(() => {
        // Set up the stub before each test
        axiosStub = sinon.stub(axios, 'get');
    });

    afterEach(() => {
        // Clean up after each test
        axiosStub.restore();
    });


    it('should return characters filtered by Data Center', async () => {
        // Given
        const mockHTML = `
        <div class="entry"><a href="/lodestone/character/21274737/" class="entry__link"><div class="entry__chara__face"><img src="https://img2.finalfantasyxiv.com/f/f714bf5b77bf7f7ee6f7888b77e8fac1_644311b63b607133c989d7c1188467dafc0.jpg?1741898335" alt="Pippo Malippo"></div><div class="entry__box entry__box--world"><p class="entry__name">Pippo Malippo</p><p class="entry__world"><i class="xiv-lds xiv-lds-home-world js__tooltip" data-tooltip="Monde d'origine"></i>Odin [Light]</p><ul class="entry__chara_info"><li><i class="list__ic__class"><img src="https://lds-img.finalfantasyxiv.com/h/e/VYP1LKTDpt8uJVvUT7OKrXNL9E.png" width="20" height="20" alt=""></i><span>4</span></li></ul></div><div class="entry__chara__lang">EN</div></a></div>
        <div class="entry"><a href="/lodestone/character/19051514/" class="entry__link"><div class="entry__chara__face"><img src="https://img2.finalfantasyxiv.com/f/d5cee8780cf3e58d3d5947591ff062c0_7206469080400ed57a5373d0a9c55c59fc0.jpg?1741900096" alt="Atrialns Bamalippp"></div><div class="entry__box entry__box--world"><p class="entry__name">Atrialns Bamalippp</p><p class="entry__world"><i class="xiv-lds xiv-lds-home-world js__tooltip" data-tooltip="Monde d'origine"></i>Lich [Light]</p><ul class="entry__chara_info"><li><i class="list__ic__class"><img src="https://lds-img.finalfantasyxiv.com/h/e/VYP1LKTDpt8uJVvUT7OKrXNL9E.png" width="20" height="20" alt=""></i><span>1</span></li></ul></div><div class="entry__chara__lang">EN</div></a></div>
        <div class="entry"><a href="/lodestone/character/10164834/" class="entry__link"><div class="entry__chara__face"><img src="https://img2.finalfantasyxiv.com/f/f396b85d7ef3b58c38c3f625c2816145_c274370774c6bc3483cc8740805f41bcfc0.jpg?1741897358" alt="Malippe Wilerck"></div><div class="entry__box entry__box--world"><p class="entry__name">Malippe Wilerck</p><p class="entry__world"><i class="xiv-lds xiv-lds-home-world js__tooltip" data-tooltip="Monde d'origine"></i>Zodiark [Light]</p><ul class="entry__chara_info"><li><i class="list__ic__class"><img src="https://lds-img.finalfantasyxiv.com/h/b/ACAcQe3hWFxbWRVPqxKj_MzDiY.png" width="20" height="20" alt=""></i><span>100</span></li><li class="js__tooltip" data-tooltip="Le Maelstrom / Capitaine"><img src="https://lds-img.finalfantasyxiv.com/h/e/9oKHHz0kfyA88mREoJobcRFT7w.png" width="20" height="20" alt=""></li></ul></div><div class="entry__chara__lang">EN/FR</div></a></div>
      `;
        axiosStub.resolves({ data: mockHTML });

        // When
        const characters = await searchCharacters('Malipp', '', 'Light');

        // Then
        expect(characters).to.be.an('array').with.lengthOf(3);

        // Verify first character
        expect(characters[0]).to.deep.include({
            name: 'Pippo Malippo',
            server: 'Odin',
            dataCenter: 'Light',
            id: '21274737'
        });

        // Verify second character
        expect(characters[1]).to.deep.include({
            name: 'Atrialns Bamalippp',
            server: 'Lich',
            dataCenter: 'Light',
            id: '19051514'
        });

        // Verify third character
        expect(characters[2]).to.deep.include({
            name: 'Malippe Wilerck',
            server: 'Zodiark',
            dataCenter: 'Light',
            id: '10164834'
        });
    });

    it('should return characters filtered by server', async () => {
        // Given
        const mockHTML = `
        <div class="entry"><a href="/lodestone/character/21274737/" class="entry__link"><div class="entry__chara__face"><img src="https://img2.finalfantasyxiv.com/f/f714bf5b77bf7f7ee6f7888b77e8fac1_644311b63b607133c989d7c1188467dafc0.jpg?1741898335" alt="Pippo Malippo"></div><div class="entry__box entry__box--world"><p class="entry__name">Pippo Malippo</p><p class="entry__world"><i class="xiv-lds xiv-lds-home-world js__tooltip" data-tooltip="Monde d'origine"></i>Odin [Light]</p><ul class="entry__chara_info"><li><i class="list__ic__class"><img src="https://lds-img.finalfantasyxiv.com/h/e/VYP1LKTDpt8uJVvUT7OKrXNL9E.png" width="20" height="20" alt=""></i><span>4</span></li></ul></div><div class="entry__chara__lang">EN</div></a></div>
      `;
        axiosStub.resolves({ data: mockHTML });

        // When
        const characters = await searchCharacters('Malipp', 'Odin', '');

        // Then
        expect(characters).to.be.an('array').with.lengthOf(1);
        expect(characters[0]).to.deep.include({
            name: 'Pippo Malippo',
            server: 'Odin',
            dataCenter: 'Light'
        });

        // Verify the URL includes the server parameter
        expect(axiosStub.firstCall.args[0]).to.include('worldname=Odin');
    });

    it('should return an empty array when no characters match', async () => {
        // Given
        const mockEmptyHTML = '<p class="parts__zero">No results found.</p>';
        axiosStub.resolves({ data: mockEmptyHTML });

        // When
        const characters = await searchCharacters('NonExistentName', '', 'Light');

        // Then
        expect(characters).to.be.an('array').that.is.empty;
    });

    it('should throw an error when the API request fails', async () => {
        // Given
        const expectedError = new Error('Network error');
        axiosStub.rejects(expectedError);

        // When & Then
        try {
            await searchCharacters('Malipp', '', 'Light');
            expect.fail('Expected an error to be thrown');
        } catch (error) {
            expect(error.message).to.include('Échec du scraping');
            expect(error.message).to.include('Network error');
        }
    });

    it('should handle malformed HTML gracefully', async () => {
        // Given
        const malformedHTML = '<div>Incomplete HTML with no character entries</div>';
        axiosStub.resolves({ data: malformedHTML });

        // When
        const characters = await searchCharacters('Malipp', '', 'Light');

        // Then
        expect(characters).to.be.an('array').that.is.empty;
    });
    ;
});