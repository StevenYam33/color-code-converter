import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from "framer-motion"

import Header from './Header';
import Footer from './Footer';
import Output from './Output';


const ColorConverter = () => {
    const [colorInput, setColorInput] = useState('');
    const [copied, setCopied] = useState({
        hex: false,
        rgb: false,
        hsl: false,
        cmyk: false,
    });
    const [convertedColor, setConvertedColor] = useState({
        hex: "#000000",
        rgb: "rgb(0, 0, 0)",
        hsl: "hsl(0, 0%, 0%)",
        cmyk: "cmyk(0%, 0%, 0%, 100%)",
        ncol: "R0, 0%, 100%",
    });
    
    const hexRegex = /^#?[\da-fA-F]+$/;
    const rgbRegex = /^(?:r?g?b?a?)?\(?(\d{1,3},\d{1,3},\d{1,3}(?:,\d*\.?\d+)?)\)?$/;
    const hslRegex = /^(?:h?s?l?)?\(?(\d{1,3},\d{1,3}%,\d{1,3}%)\)?$/;
    const cmykRegex = /^(?:c?m?y?k?)?\(?(\d{1,3}%,\d{1,3}%,\d{1,3}%,\d{1,3}%)\)?$/;

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        const sanitizedInput = inputValue.replace(/\s/g, ''); // Remove spaces
        setColorInput(sanitizedInput);

        const hexColor = '#' + convertToHEX(sanitizedInput);
        const rgbColor = convertToRGB(sanitizedInput);
        const hslColor = convertToHSL(sanitizedInput);
        const cmykColor = convertToCMYK(sanitizedInput);

        setConvertedColor({
            hex: hexColor,
            rgb: rgbColor,
            hsl: hslColor,
            cmyk: cmykColor,
        });
    };

    const extractHex = (input) =>{
        let hexNum = input.replace(/^#/, ''); 
        let validColor = "000000"
        let hex;
        
        if (hexNum.length >= 3 && hexNum.length < 6) {
            hex = hexNum.slice(0, 3); // Take the first 3 characters
            hex = hex.split('').map(char => char + char).join('');
        } else  if (hexNum.length >= 6) {
            hex = hexNum.slice(0, 6); // Take the first 6 characters
        } else {
            hex = validColor
        }

        return hex.toUpperCase();
    }

    const extractRgb = (input) => {
        let validColor = 'rgb(0, 0, 0)'

        const [red, green, blue] = input.match(rgbRegex)[1].split(',').map(val => {
            let num = parseInt(val.trim(), 10);
            return num > 255 ? 255 : num; // Ensure values don't exceed 255
        });

        return {r : red, g : green, b : blue};
    }

    const extractHsl = (input) => {
    const [h, s, l] = input.match(/\d+/g);

        const hue = parseInt(h > 359 ? 0 : h, 10);
        const saturation = parseInt(s > 100 ? 100 : s, 10) / 100;
        const lightness = parseInt(l > 100 ? 100 : l, 10) / 100;

        return {h : hue, s : saturation, l : lightness};
    }

    const extractCmyk = (input) => {
        const [c, m, y, k] = input.match(/\d+/g);

        const cyan = parseInt(c > 100 ? 100 : c, 10) / 100;
        const magenta = parseInt(m > 100 ? 100 : m, 10) / 100;
        const yellow = parseInt(y > 100 ? 100 : y, 10) / 100;
        const black = parseInt(k > 100 ? 100 : k, 10) / 100;

        return {c : cyan, m : magenta, y : yellow, k : black};
    }

    const rgbToHex = (red, green, blue) => {
        const hex = `${((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1)}`;

        return hex.toUpperCase();
    }

    const rgbToHsl = (red, green, blue) => {
        // Normalize the RGB values to be between 0 and 1
        const rNormalized = red/ 255;
        const gNormalized = green / 255;
        const bNormalized = blue / 255;

        // Find the maximum and minimum values to determine lightness and saturation
        const max = Math.max(rNormalized, gNormalized, bNormalized);
        const min = Math.min(rNormalized, gNormalized, bNormalized);

        const lightness = (max + min) / 2;

        let hue, saturation;

        if (max === min) {
            hue = saturation = 0; // achromatic
        } else {
            const d = max - min;
            saturation = lightness > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case rNormalized:
                    hue = ((gNormalized - bNormalized) / d + (gNormalized < bNormalized ? 6 : 0));
                    break;
                case gNormalized:
                    hue = (bNormalized - rNormalized) / d + 2;
                    break;
                case bNormalized:
                    hue = (rNormalized - gNormalized) / d + 4;
                    break;
                default:
                    break;
            }

            hue *= 60;
        }

        return {h : Math.round(hue), s : Math.round(saturation * 100), l : Math.round(lightness * 100)};
    }

    const rgbToCmyk = (red, green, blue) => {
        let cyan, magenta, yellow;

        // Normalize the RGB values to be between 0 and 1
        const rNormalized = red/ 255;
        const gNormalized = green / 255;
        const bNormalized = blue / 255;

        const max = Math.max(rNormalized, gNormalized, bNormalized);
        let black = 1 - max;

        if (black == 1) {
            cyan = 0;
            magenta = 0;
            yellow = 0;
        } else {
            cyan = (1 - rNormalized - black) / (1 - black);
            magenta = (1 - gNormalized - black) / (1 - black);
            yellow = (1 - bNormalized - black) / (1 - black);
        }

        return {c : Math.round(cyan * 100), m : Math.round(magenta * 100), y : Math.round(yellow * 100), k : Math.round(black * 100)};
    }

    const hexToRgb = (hexNum) => {
        const red = parseInt(hexNum.substring(0, 2), 16);
        const green = parseInt(hexNum.substring(2, 4), 16);
        const blue = parseInt(hexNum.substring(4, 6), 16);

        return {r : red, g : green, b : blue};
    }

    const hslToRgb = (hue, saturation, lightness) => {
        // check if sat and light is in %

        const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
        const m = lightness - c / 2;

        let r, g, b;

        if (hue >= 0 && hue < 60) {
            r = c; g = x; b = 0;
        } else if (hue >= 60 && hue < 120) {
            r = x; g = c; b = 0;
        } else if (hue >= 120 && hue < 180) {
            r = 0; g = c; b = x;
        } else if (hue >= 180 && hue < 240) {
            r = 0; g = x; b = c;
        } else if (hue >= 240 && hue < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }

        const red = Math.round((r + m) * 255);
        const green = Math.round((g + m) * 255);
        const blue = Math.round((b + m) * 255);

        return {r : red, g : green, b : blue};
    }

    const cmykToRgb = (cyan, magenta, yellow, black) => {
        const red = 255 - ((Math.min(1, cyan * ( 1 - black ) + black)) * 255);
        const green = 255 - ((Math.min(1, magenta * ( 1 - black ) + black)) * 255);
        const blue = 255 - ((Math.min(1, yellow * ( 1 - black ) + black)) * 255);

        return {r : Math.round(red), g : Math.round(green), b : Math.round(blue)};
    }

    const convertToHEX = (color) => {
        let validColor = "000000"

        if (color.match(hexRegex)) { // HEX to HEX
            // Extract HEX values
            const hex = extractHex(color);

            return hex;

        } else if (color.match(rgbRegex)) { // RGB to HEX
            // Extract RGB values
            const rgb = extractRgb(color);

            // Convert RGB to HEX
            const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

            return hex;

        } else if (color.match(hslRegex)) { // HSL to RGB to HEX
            // Extract HSL values
            const hsl = extractHsl(color);

            // Convert HSL to RGB
            const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
            
            // Convert RGB to HEX
            const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

            return hex;
        } else if (color.match(cmykRegex)) { // CMYK to RGB to HEX
            // Extract CMYK values
            const cmyk = extractCmyk(color);

            // Convert CMYK to RGB
            const rgb = cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k);

            // Convert RGB to HEX
            const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
            
            return hex;
        } else {
            // Handle invalid input (not a valid hex color)
            return validColor;
        }
    };

    const convertToRGB = (color) => {
        let validColor = 'rgb(0, 0, 0)'

        if (color.match(hexRegex)) { //HEX to RGB
            // Extract HEX values
            const hex = extractHex(color);

            // Convert HEX to RGB
            const rgb = hexToRgb(hex);
            
            return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

        } else if (color.match(rgbRegex)) { // RGB to RGB
            // Extract RGB values
            const rgb = extractRgb(color);
    
            return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

        } else if (color.match(hslRegex)) { // HSL to RGB
            // Extract HSL values
            const hsl = extractHsl(color);
    
            // Convert HSL to RGB
            const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);

            return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

        } else if (color.match(cmykRegex)) { // CMYK to RGB
            // Extract CMYK values
            const cmyk = extractCmyk(color);
            
            // Convert CYMK to RGB
            const rgb = cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k)

            return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        } else {
            // Handle invalid input (not a valid rgb color)
            return validColor;
        }
    };
      
    const convertToHSL = (color) => {
        let validColor = 'hsl(0, 0%, 0%)'

        if (color.match(hexRegex)) { // HEX to HSL
            // Extract HEX values
            const hex = extractHex(color);

            // Convert HEX to RGB
            const rgb = hexToRgb(hex);

            // Convert RGB to HSL
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

            return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

        } else if (color.match(rgbRegex)) { // RGB to HSL
            // Extract RGB values
            const rgb = extractRgb(color);

            // Convert RGB to HSL
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

            return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

        } else if (color.match(hslRegex)) { // HSL to HSL
            // Extract HSL values
            const hsl = extractHsl(color);

            return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;

        } else if (color.match(cmykRegex)) { // CMYK to HSL
            // Extract CMYK values
            const cmyk = extractCmyk(color);

            // Convert CMYK to RGB
            const rgb = cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k);

            // Convert RGB to HSL
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

            return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        } else {
            // Handle invalid input (not a valid hsl color)
            return validColor;
        }
    };

    const convertToCMYK = (color) => {
        let validColor = 'cmyk(0%, 0%, 0%, 100%)'

        if (color.match(hexRegex)){ // HEX to CMYK
            // Extract HEX values
            const hex = extractHex(color);

            // Convert HEX to RGB
            const rgb = hexToRgb(hex);

            // Convert RGB to CMYK
            const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

            return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`

        } else if (color.match(rgbRegex)){ // RGB to CMYK
            // Extract RGB values
            const rgb = extractRgb(color);

            // Convert RGB to CMYK
            const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

            return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`

        } else if (color.match(hslRegex)){ // HSL to CMYK
            // Extract HSL values
            const hsl = extractHsl(color);

            // Convert HSL to RGB
            const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);

            // Convert RGB to CMYK
            const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

            return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`

        } else if (color.match(cmykRegex)){ // CMYK to CMYK
            // Extract CMYK values
            const cmyk = extractCmyk(color);

            return `cmyk(${cmyk.c * 100}%, ${cmyk.m * 100}%, ${cmyk.y * 100}%, ${cmyk.k * 100}%)`

        } else {
            return validColor;
        }
    };

    const blackValue = (cmyk) => {
        const black = extractCmyk(cmyk).k

        return black
    }

    const copyToClipboard = async (colorType) => {
        let colorValue = document.getElementById(colorType).innerHTML;
        
        try {
            await navigator.clipboard.writeText(colorValue);
            
            console.log(colorValue + ' copied to clipboard');

            // // Set the iconClicked state to trigger the transition
            // setCopied(true);

            // // Reset the iconClicked state after the transition duration (500ms)
            // setTimeout(() => {
            //     setCopied(false);
            // }, 1000);

            // Set the specific color type copied state to true
            setCopied(prevState => ({ ...prevState, [colorType]: true }));

            // Reset the specific color type copied state after the transition duration (1000ms)
            setTimeout(() => {
                setCopied(prevState => ({ ...prevState, [colorType]: false }));
            }, 1000);

        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }
      
    return (
        <div 
            className='converter'
            style={{
                background: convertedColor.rgb, 
                color: blackValue(convertedColor.cmyk) < 0.5 ? 'black' : 'white',
                transition: 'background ease-in 500ms'
            }}
        >
            <Header />

            <input
                type="text"
                value={colorInput}
                onChange={handleInputChange}
                placeholder="Enter color value"
                style={{
                    borderColor: blackValue(convertedColor.cmyk) < 0.5 ? 'black' : 'white',
                    color: blackValue(convertedColor.cmyk) < 0.5 ? 'black' : 'white'
                }}
            />
            <ul className='output'>
                <p>Converted Color:</p>
                <li>
                    <Output 
                        colorType="hex"
                        colorValue={convertedColor.hex}
                        isCopied={copied.hex}
                        onCopy={copyToClipboard}
                    />
                </li>
                <li>
                    <Output
                        colorType="rgb"
                        colorValue={convertedColor.rgb}
                        isCopied={copied.rgb}
                        onCopy={copyToClipboard}
                    />
                </li>
                <li>
                    <Output
                        colorType="hsl"
                        colorValue={convertedColor.hsl}
                        isCopied={copied.hsl}
                        onCopy={copyToClipboard}
                    />
                </li>
                <li>
                    <Output
                        colorType="cmyk"
                        colorValue={convertedColor.cmyk}
                        isCopied={copied.cmyk}
                        onCopy={copyToClipboard}
                    />
                </li>
            </ul>

            <Footer />
        </div>
    );
};

export default ColorConverter;
