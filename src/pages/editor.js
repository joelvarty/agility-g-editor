/* eslint-disable spaced-comment */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import types from '../data/types';
import { changeType } from '../globals/fake-data';

import './editor.scss';

const { data, editPost, domReady } = window.wp;


const Editor = () => {

	const [postType, setPostType] = useState("page");

	useEffect(() => {
		const settings = {
			alignWide: true,
			availableTemplates: [],
			allowedBlockTypes: true,
			disableCustomColors: false,
			disableCustomFontSizes: false,
			disablePostFormats: false,
			titlePlaceholder: 'Add title',
			bodyPlaceholder: 'Insert your custom block',
			isRTL: false,
			autosaveInterval: 3,
			style: [],
			imageSizes: [],
			richEditingEnabled: true,
			postLock: {
				isLocked: false,
			},
			postLockUtils: {
				nonce: '123456789',
			},
			enableCustomFields: true,
			mediaLibrary: true,
			__experimentalBlockPatterns: [],
			__experimentalBlockPatternCategories: [],
			__experimentalDisableCustomLineHeight: [],
			__experimentalDisableCustomUnits: [],
			__experimentalEnableLinkColor: [],
		};

		// Disable publish sidebar
		data.dispatch('core/editor').disablePublishSidebar();

		// Disable tips
		data.dispatch('core/nux').disableTips();

		window.addEventListener("message", function (e) {

			//only care about these messages
			if (e.data.type === 'setInitialValueForCustomField') {
				const json = e.data.message;
				console.log("data from Agility", json);
				localStorage.setItem('g-editor-page', json);

				// Initialize the editor
				window._wpLoadBlockEditor = new Promise(resolve => {
					domReady(() => {
						resolve(editPost.initializeEditor('editor', postType, 1, settings, {}));
					});
				});
			}
		}, false);



	}, [])



	const resetLocalStorage = ev => {
		ev.preventDefault();

		localStorage.removeItem('g-editor-page');
		sessionStorage.removeItem('wp-autosave-block-editor-post-1');
		window.location.reload();
	};

	const changePostType = (ev, type) => {
		ev.preventDefault();
		// update postType in localStorage before reload the editor
		const slug = type.slice(0, -1);
		changeType(slug);

		window.location.replace(type);
	};

	return (
		<React.Fragment>
			<div className="editor-nav">
				{/* {
					['post', 'page'].map(type => {
						return (
							<button
								key={type}
								className={`components-button ${type === postType ? 'is-primary' : ''}`}
								onClick={ev => changePostType(ev, types[type].rest_base)}
							>{types[type].name}</button>
						);
					})
				}

				<button type="button" className="components-button is-tertiary"
					onClick={resetLocalStorage}>Clear page and reload</button> */}
			</div>
			<div id="editor" className="gutenberg__editor"></div>
		</React.Fragment>
	);

}

export default Editor;
