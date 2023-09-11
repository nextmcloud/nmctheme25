(function() {

	const FilesPlugin = {

		attach(fileList) {
			var self = this;
			const actionHandler = () => {
				this._onClickCancelSelected(fileList);
			}

			fileList.registerMultiSelectFileAction({
				name: 'cancel',
				displayName: t('files', 'Cancel'),
				iconClass: 'icon-close',
				order: 101,
				action: actionHandler,
			})

			fileList.updateSelectionSummary = function() {
				var self = this;
				var summary = fileList._selectionSummary.summary;
				var selection;

				var showHidden = !!fileList._filesConfig.show_hidden;

				console.log(fileList);

				var fileTable = fileList.$table;
				fileTable.find('.column-selection > label > span').text(t('files', 'All'));
				
				if (summary.totalFiles === 0 && summary.totalDirs === 0) {
					fileTable.find('.column-name a.name > span:first').text(t('files', 'Name'));
					fileTable.find('table').removeClass('multiselect');
					fileTable.find('.column-size').removeClass('hidden');
					fileTable.find('.column-mtime').removeClass('hidden');
					fileTable.find('.selectedActions').addClass('hidden');
				} else {
					fileTable.find('.column-size').addClass('hidden');
					fileTable.find('.column-mtime').addClass('hidden');
					fileTable.find('.selectedActions').removeClass('hidden');

					fileList.fileMultiSelectMenu.show(self);

					var directoryInfo = n('files', '%n folder', '%n folders', summary.totalDirs);
					var fileInfo = n('files', '%n file', '%n files', summary.totalFiles);

					if (summary.totalDirs > 0 && summary.totalFiles > 0) {
						var selectionVars = {
							dirs: directoryInfo,
							files: fileInfo
						};
						selection = t('files', '{dirs} and {files}', selectionVars);
					} else if (summary.totalDirs > 0) {
						selection = directoryInfo;
					} else {
						selection = fileInfo;
					}

					if (!showHidden && summary.totalHidden > 0) {
						var hiddenInfo = n('files', 'including %n hidden', 'including %n hidden', summary.totalHidden);
						selection += ' (' + hiddenInfo + ')';
					}

					if (summary.totalSize > 0) {
						selection += ' (' + OC.Util.humanFileSize(summary.totalSize) + ')';
					}

					$('.column-name a.name > span:first').text(selection);

					$('table').addClass('multiselect');

					if (fileList.fileMultiSelectMenu) {
						fileList.fileMultiSelectMenu.toggleItemVisibility('download', fileList.isSelectedDownloadable());
						fileList.fileMultiSelectMenu.toggleItemVisibility('delete', fileList.isSelectedDeletable());
						fileList.fileMultiSelectMenu.toggleItemVisibility('copyMove', fileList.isSelectedCopiable());
						if (fileList.isSelectedCopiable()) {
							if (fileList.isSelectedMovable()) {
								fileList.fileMultiSelectMenu.updateItemText('copyMove', t('files', 'Move or copy'));
							} else {
								fileList.fileMultiSelectMenu.updateItemText('copyMove', t('files', 'Copy'));
							}
						} else {
							fileList.fileMultiSelectMenu.toggleItemVisibility('copyMove', false);
						}
					}

					if (fileList.fileMultipleSelectionMenu) {
						fileList.fileMultipleSelectionMenu.toggleItemVisibility('download', fileList.isSelectedDownloadable());
						fileList.fileMultipleSelectionMenu.toggleItemVisibility('delete', fileList.isSelectedDeletable());
						fileList.fileMultipleSelectionMenu.toggleItemVisibility('copyMove', fileList.isSelectedCopiable());
						if (fileList.isSelectedCopiable()) {
							if (fileList.isSelectedMovable()) {
								fileList.fileMultipleSelectionMenu.updateItemText('copyMove', t('files', 'Move or copy'));
							} else {
								fileList.fileMultipleSelectionMenu.updateItemText('copyMove', t('files', 'Copy'));
							}
						} else {
							fileList.fileMultipleSelectionMenu.toggleItemVisibility('copyMove', false);
						}
					}
				}
			}
		},

		_onClickCancelSelected: function (fileList) {
			fileList._selectedFiles = {};
			fileList._selectionSummary.clear();
			fileTable.find('input').prop('checked', false);
			fileTable.find('td.selection > .selectCheckBox:visible').closest('tr').toggleClass('selected', false);
			fileList.updateSelectionSummary();
		}
	}

	OC.Plugins.register('OCA.Files.FileList', FilesPlugin)
})()