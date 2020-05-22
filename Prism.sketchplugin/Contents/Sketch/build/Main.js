// Generated by CoffeeScript 1.12.7

/*
 Generate Palette

 Called when the user wants to generate a palette from its Document Colors
 */
var colorNameChanged, exportAll, exportSelected, generatePalette, openTemplate;

generatePalette = function(context) {
  var palette;
  log("Generating...");
  palette = new Palette(context);
  return palette.generate();
};


/*
 Color Name Changed

 Called when the user makes a change in any text layer. Used to add or remove new alias for colors.
 */

colorNameChanged = function(context) {
  var artboard, color, colorAsset, colorAssetRepo, colorDict, colorValue, document, inPalette, newText, oldText, palette, parentLayer, pluginID, textLayer;
  log("Color Name Changed...");
  textLayer = context.actionContext.layer;
  parentLayer = textLayer.parentGroup();
  artboard = textLayer.parentArtboard();
  newText = context.actionContext["new"];
  oldText = context.actionContext.old;
  pluginID = context.plugin.identifier();
  colorValue = context.command.valueForKey_onLayer_forPluginIdentifier(Cell.prototype.TEXT_LAYER_TAG, textLayer, pluginID);
  inPalette = context.command.valueForKey_onLayer_forPluginIdentifier(Palette.prototype.ARTBOARD_TAG, artboard, pluginID);
  if (!(colorValue && inPalette)) {
    return;
  }
  document = require('sketch/dom').getSelectedDocument().sketchObject;
  if (("" + newText).trim() !== "") {
    context.command.setValue_forKey_onLayer_forPluginIdentifier(newText, colorValue, artboard, pluginID);
    colorAssetRepo = new ColorAssetRepository(document);
    colorDict = context.command.valueForKey_onLayer_forPluginIdentifier(Cell.prototype.CELL_LAYER_TAG, parentLayer, pluginID);
    color = ColorFormatter.dictionaryToColor(colorDict).immutableModelObject();
    colorAsset = colorAssetRepo.colorAssetByName(("" + oldText).trim());
    colorAsset.name = newText;
  } else {
    context.command.setValue_forKey_onLayer_forPluginIdentifier(null, colorValue, artboard, pluginID);
  }
  context["document"] = document;
  palette = new Palette(context, textLayer);
  return palette.regenerate();
};


/*
 Export All

 Called when the user wants to export all the colors in the palette (not in the Document Colors)
 */

exportAll = function(context) {
  var colorDictionaries, colorFormatter, palette, responseCode;
  log("Export All...");
  palette = new Palette(context);
  colorDictionaries = palette.getColorsDictionaries();
  colorFormatter = new ColorFormatter();
  responseCode = colorFormatter.showDialogWithColorDictionaries(colorDictionaries);
  switch (responseCode) {
    case 1000:
      return context.document.showMessage("Your colors were successfully saved!");
    case 1001:
      return context.document.showMessage("Copied to clipboard!");
  }
};


/*
 Export Selected

 Called when the user wants to export only the selected Cell Groups.
 */

exportSelected = function(context) {
  var colorDictionaries, colorFormatter, palette, responseCode, selectedLayers;
  log("Export Selected...");
  selectedLayers = context.selection;
  if (selectedLayers.count() === 0) {
    NSApplication.sharedApplication().displayDialog_withTitle("No color cells were selected for export!", "Nothing selected");
    return;
  }
  palette = new Palette(context);
  colorDictionaries = palette.getColorsDictionariesFromLayers(selectedLayers);
  colorFormatter = new ColorFormatter();
  responseCode = colorFormatter.showDialogWithColorDictionaries(colorDictionaries);
  switch (responseCode) {
    case 1000:
      return context.document.showMessage("Your colors were successfully saved!");
    case 1001:
      return context.document.showMessage("Copied to clipboard!");
  }
};


/*
 Open Template

 Called when the users wants to open the template file that all the cells are generated from.
 */

openTemplate = function(context) {
  var template;
  log("Open Template...");
  template = new Template(context.plugin.url());
  return template.openTemplateFile();
};
