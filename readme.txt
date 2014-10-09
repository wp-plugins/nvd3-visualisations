=== Plugin Name ===
Contributors: Jouni Santara, TERE-tech ltd
Donate link: http://www.tere-tech.eu/
Tags: nvd3, d3, visualisation, visualization, infographic, chart, graph, CSS, CSS3, SVG, vector graphics, DOM, HTML5
Requires at least: 3.3.2
Tested up to: 3.9
Stable tag: 1.8.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

NVD3 visualisations give you tools on WordPress to generate impressive business quality charts based on the famous open NVD3 framework of JavaScript. 

== Description ==

NVD3 visualisations is a full set of visually interactive charts that can be controlled by simple options.

You can start to create any example chart into your blog and study it more before you decide if that suits for your visual presentation's needs at hand.

This product lets you generate as many copies of different charts on the one page as you wish and scale their size just the way you like case by case.

All the example's input data sets are stored in the same format on data folder so that you can easily copy them and start to use them as a template for your own data's needs.

This package is produced as an example how to bring in high level chart galleries into WordPress CMS and there is no active support available. 

If you like it give us some stars on WP plugin site so that others can find it more easily too 
- thank you !
.

**Key Features**

1. Special effects for infographic: embedding background's picts, smooth gradients of colors for data, and shadows.
1. Full set of all original NVD3's gallery charts (12 types of charts in gallery).
1. Super easy to illustrate your data sets by picking up template chart from any gallery's examples.
1. WYSIWYG look of chart on front-end + data editor to populate own data from files.
1. Chart's picker gives your users many views of the same data set.
1. Support of JSON/XML or CSV/TSV data input formats.
1. Smart suggestion of online syntax editor from cloud based on data's type.
1. Copy&paste data input table from OpenOffice Calc to the automatically updated chart.
1. Tag any pieces of open page/post and build a new chart for them.
1. Accurate layout of each chart based on any valid HTML container tag.
1. Many charts on the same page/post of WordPress from one API / shortcode call.
1. Many fancy options available to change chart's look & behavior.
1. Dynamic & direct illustration of any JavaScript function results.
1. Visual preview of charts from the NVD3 lib's original CSS style file to let you match blog's theme easily.
1. Handy calculator letting users to modify chart fast by any basic math formulas.
1. Localized presentation formats for currency, date, time, etc.
1. Optional export of data / vector graphics of chart.
1. Works best with Chrome & Firefox browsers. 
1. WordPress multisite & SSL compatible plugin. 
.

**Data Input**

1. Fast & short input from intuitive fast options (values, labels, and series).
1. Direct data input from the html tags of document (eq page/post).
1. Data's import from valid JSON/XML/CSV/TSV file formats.
1. Dynamic JSON inputs from any own JavaScript functions.
.

**HAPPY CHARTING on WordPress !**

**Credits**

This open source distribution contains visualisation libraries from:

* [Robin Hu, NVD3] (http://github.com/novus/nvd3  "Higher level library to create fast & easy D3 charts.")
* [Michael Bostock, D3] (http://github.com/mbostock/d3  "Famous open source visualisation library core.")

Big thanks for these talents by making NVD3 visualisations for WordPress technically possible too.

== Installation ==

Two WP standard ways to install the package.

1. Go to wordpress 'Dashboard' front page.
1. Select PlugIns / Add New for searching new plugin from internet.
1. Write 'NVD3' to the search box + Search PlugIns.
1. Select 'Install Now' under the result of 'NVD3 tools'.
1. Activate the PlugIn on WordPress after its download.
1. Create a new page for charts selection gallery by calling [demosGallery] shortcode.
1. View + bookmark this page and start to clone your charts & edit them.
1. More tips: go to nvd3 plugin's edit (Plugins->Installed plugins->NVD3 Visualisations->edit) and start to read from read_me_1st.txt.

Or you may want to do it: 'old traditional way'.

1. Download `nvd3` folder into your local computer.
1. Upload this folder next to the `/wp-content/plugins/` directory into your WordPress server side.
1. Activate the plugin through the 'Plugins' menu in WordPress.
1. Create a new page for charts selection gallery by calling [demosGallery] shortcode.
1. View + bookmark this page and start to clone your charts & edit them.
1. More tips: go to nvd3 plugin's edit (Plugins->Installed plugins->NVD3 Visualisations->edit) and start to read from read_me_1st.txt.

== Frequently Asked Questions ==

= How can I visualize my own data set? =

1. You just create your charts gallery by its shortcode [demosGallery] and pick up the right style of chart there for the task.
1. Next, you choose if you want this new chart into page / post of WordPress.
1. Before creating new chart by button you select from 8 different sources where your data is coming from.
1. New chart button takes you to the 2nd step where you actually populate your own data in.
1. Rest of publishing follows normal standard work flow of WordPress: just edit, preview & publish it.

= I just want a quick way to show my small data set and not to edit any external files. Can I do this? =

Sure, go to the charts library and select data input method **Direct Input**, press new chart button, and follow its further online help.

Also, you migt like to take a look at **shortcode_direct_data.txt** on examples folder, please.

= How can I change the margins around the chart bigger? =

You have 2 choices here: outside of chart container (normally div/span element) or inside its svg element. Take a look at example **shortcode_margins_demo.txt** to learn more about these options, please.

= How can I change the look of elements of chart from default (eq its lines, bars, etc)? =

You can set palette of custom colors for each chart (bars, etc) separately with the following ways:

1. If you wish to set own custom palette, use **colors** option. Example - options="{colors:'red,green,blue'}"
1. If you wish to have fixed set of palettes, use **colorbrewer** option. Example - options="{colorbrewer:{palette:'Blues'}}"
1. If you wish to build colors smooth gradients. Example - options="{ colors:{startbar:'red', endbar:'lime'} }"
1. Finally, there is an option **style** that feeds in all legal values to the chart's svg raw structure. A normal example - options="{ style:{'fill':'orange', 'stroke':'navy'} }"

= Where are my data sets (of files) stored and what happens for them if I remove chart's page/post or whole plugin? =

Look at the blog's root and the folder called **charts_nvd3**. Data sets are stored there by random names and they stay there until you remove them by FTP client manually. If you create very many/big data sets it is a pretty good idea to clean this folder from time to time.

= Is it possible to have multiple charts on the same WP post or page? =

Good point & question here !

YES indeed, the software is design so that it transparently creates and draws many charts on the same page and gives you exact control where you like to show them.

= I am not a tech guru & I hate to learn JavaScript API etc, is there any - just a simple way - to draw charts? =

Shortcode [jsChart] is your easy solution then: first create charts gallery by [demosGallery] shortcode & then start cloning your own charts to the new page/post. Each cloning of new chart creates you full example call of [jsChart] shortcode with a lot of options for it that you can try to turn on and off. All this happens safely in preview mode of WordPress before you are ready to publish it.

**Note:** since ver.1.8.0 charts gallery is improved to new visual form. If you need/prefer the old (table) type of look, you just call it by [demosGallery_old] shortcode. 

Also, peek into **examples** folder of plugin and start to test shortcodes demos there with your blog.

= HELP!! There are SO namy options generated by gallery of chart picker: do I need to learn them all? =

No, you just remove all the options that you do not like/need and shortcode sets them to sensible default values  automatically on the background.

= How do I know which options work together with the chart type that I use? =

Look at inside **chart_options.html** file and its comparisions table, please.

= Where is open source if I want to improve it? =

Here:
* http://github.com/wp-plugins/nvd3-visualisations

== Screenshots ==

1. Chart Picker Helps to Decide which Visualization to Use.
2. 4 FAST STEPS of New Chart: 1)CLONE from Picker, 2)FEED IN Own Data, 3)EDIT Draft of Post/Page Normally, 4)PUBLISH It.
3. Same Data Set on 4 Different Ways by Using Chart's Picker.
4. Exporting for Chart & Its Data Turned on for Public Readers (eq **exports** Option).
5. Automatically Updated Charts + Fast Import from OpenOffice by **table** Option. 
6. Old Charts Gallery Showing Out on The Same Page of WP's Blog. 

== Changelog ==

= 1.8.3 =
Version 1.8.3 -
Option **links** can have javascript calls as a link when you click a segment of chart (eq **javascript:**). Chart's calculator works on chart's popup windows properly too. Quick tutorial for links use when you clone direct input data from gallery of chart picker.

= 1.8.2 =
Version 1.8.2 -
Get even cooler interactive charts for your readers & support your infographic story: chart's visual elements can have hyperlinks now to any web pages individually by setting an new option **links** (works just like **colors** & **labels**, btw). This works with direct data input & 1-dim basic charts at this point. Adding standard SVG's **transform** option for labels of x- and y-axis: you may find it very usefull to **rotate(20 -20,0)** when your labels just get too crowded and want to breath better.

= 1.8.1 =
Version 1.8.1 -
Relabelling or removal of all labels on X-axis is available now by calling easy **xaxis** option for most of the chart types. Support of standard html tag's **style** attribute with **xaxis** and **yaxis** options that let you format appearence of each axis by all CSS + extended features of SVG - chart by chart. Resizing of window does not redraw charts anymore automatically since that was resetting own color's settings away.

= 1.8.0 =
Version 1.8.0 -
NEW: graphics UX rocks U2, yes!!? Charts gallery gets its visual UI tabs for each bigger chart. Data editor has a converter from CSV/TSV -> JSON formats on front-end side. Examples of coloring charts by data values. 

= 1.7.3 =
Version 1.7.3 -
Smooth gradient coloring for chart's elements based on data value by use of option **colors:{values:true, startbar:"lime", endbar:"red"}** that works similar fashion than with d3-simplechart plugin (eq gradient:"values" over there). Automatic and manual rescaling of Y-axis  (eq values) with new **domain** option. Negative values charted correctly for direct cells input of document (eq an issue of non-numeric filter fixed).

= 1.7.2 =
Version 1.7.2 -
Short online helps generated for some gallery's cloned chart's input types to use them faster. Different locale for each chart by **locale** option (US/FI/RU supported) if you need it. Option **calculatorlock** if you want to froze the preset given formula and **calculatorhide** for hiding it visible from readers.

= 1.7.1 =
Version 1.7.1 -
Fast input examples direcly from charts gallery for these data sources: direct shortcode's input, document's cells, and imported tables (of OpenOffice Calc). More flexible & faster direct input format is available from shortcode.

= 1.7.0 =
Version 1.7.0 -
NEW: handy interactive calculator for the chart. By setting **calculator** option you give your readers freedom to scale visually the chart as they wish (eq formulas by + - * / operators). Two other options help this - **calculatortitle** and **calculatorunit** - which let you tell what questions calculator solves with each chart. Support of locale for country specific data formats. Some new designs of icons. Fixing minor bugs.

= 1.6.9 =
Version 1.6.9 -
Popup chart/window gets full screen viewing mode & its buttons. Better code to parse tables (2-dimensional: multibar, etc) into chart and export on popup window. New option **autocoloring** supports cloning the colors from table to chart & vice versa.

= 1.6.8 =
Version 1.6.8 -
Option **table** supports data **exports** and **chartpicker** on popup window. Restructuring of code for OOPS package continues.

= 1.6.7 =
Version 1.6.7 -
The best option **table** that lets you build from OpenOffice tables automatically updating charts real fast & have their colors copied to elements of chart too (look at screenshot nr 5). This works with all chart types which have TSV file on examples/ folder. Adding **seriescolor** option for **class** to let you name time series etc. Starting to restructure code more like real OOPS package.

= 1.6.6 =
Version 1.6.6 -
Multidimensional & -series data generates charts on the same way as below: set different bgcolor for each data set. This works with the **multibar** chart type at first. Including OpenOffice Calc examples file.

= 1.6.5 =
Version 1.6.5 -
Chart's labels generated automatically from OpenOffice tables too with new option **titlecolor**. Better examples how to call & show up OpenOffice tables.

= 1.6.4 =
Version 1.6.4 -
Opening fast copy & paste way of creating charts from OpenOffice tables with minimum efforts. Allowing HTLM tags of document to containg character + special characters and still accepted as input data. Examples/ how to use **class** option with OpenOffice tables.

= 1.6.3 =
Version 1.6.3 -
Direct input method accepts HTML tags of Page/Post: data values are picked from the contents of same class & chart's labels from ID attributes (if existing). Fixing multisite/SSL root directory issue + other small bugs. Examples/ how to use **class** option.

= 1.6.2 =
Version 1.6.2 -
More cool shadows for all you infographic fans out there (try discretebar chart). Fixing smooth gradients coloring to work for discretebar's data set. Option **exports** of data supports also CSV and TSV file's input formats if turned on (default is  **exports:false** eq no exports allowed).

= 1.6.1 =
Version 1.6.1 -
Exporting buttons (Excel & SVG edit) on popup windows:exporting of data set by option **exports** in Excel's CSV and in Illustrator's SVG formats. Positioning of background image by x and y coordinates (eq **backgroundimage** can be JSON object too) based on SVG element W3C standards. Quite afew bugs removed.

= 1.6.0 =
Version 1.6.0 -
NEW: Uniform interactive comparing of the data set by chart's picker buttons on all popup windows called by new option **chartpicker**. This supports CSV/TSV inputs (max 8 chart's types) and direct data (max 6 chart's types). Better titles for popup's charts from options.

= 1.5.12 =
Version 1.5.12 -
More support of infographics: **background-image** supports also now a list of picts + their file names (eq random backgrounds) as its input. Format support for data values of Pie and Donut chart types added.

= 1.5.11 =
Version 1.5.11 -
Support of very simple direct input of data by **values**, **labels**, and **series** options (similar than in D3 simplecharts plugin) for all chart types. Renaming of some functions to remove conflicts with D3 simplecharts. Short examples how to call direct data for a few chart types.

= 1.5.10 =
Version 1.5.10 -
More spices & impressive effects for infographics. Let there be **shadows** and there is the option for that. How about **background-image** or **background-color** ? No problem, there they are. Examples of coloring improved to document it all better & gallery looks more attractive, too. 

= 1.5.9 =
Version 1.5.9 -
Coloring option **colors** accepts & generates smooth gradients between given start & end colors (by Lab color model). Examples about how to set custom colors and format of axis.

= 1.5.8 =
Version 1.5.8 -
Expanding coloring for segments of charts: by **colorbrewer** option + palettes or own given set by **colors** option. Support of standard format of D3 on values axis of charts: **format** option. Removing x-axis time dependence from a few chart types. Better default margins for all demo charts.

= 1.5.7 =
Version 1.5.7 -
Support of standard margin options for the chart itself and its external container from input options. The 1st primitive way to change chart's drawing svg styles: color of stroke, fill, opacity, etc. New example of margins use.

= 1.5.6 =
Version 1.5.6 -
Chart's cloning into own popup window + its printing option from there. Resizeable popup charts. Standard border and backgroundcolor support.

= 1.5.5 =
Version 1.5.5 -
Three more chart types accept TSV/CSV input formats (eq cumulativeline, stackedarea, and lineplusbar) and clone from gallery's TSV examples. Support of standard style's float option for right/left placements of chart. 

= 1.5.4 =
Version 1.5.4 -
Three new chart types accept TSV/CSV input formats (eq pie,donut, and discretebar) and clone from gallery. Better filtering of xml input on data editor.

= 1.5.3 =
Version 1.5.3 -
Data converter between json and xml on data editor. More human readable data sets, prettified. Fixed ugly bug of url redirection in creating new chart from gallery.

= 1.5.2 =
Version 1.5.2 -
Chart's dimensions & options visible for easy edit on its created shortcodes. Just publish it: 1-2-3-4 steps on screenshot how to publish from charts gallery.

= 1.5.1 =
Version 1.5.1 -
Better security for data editor's updates of chart data. Expanding gallery to create XML, CSV & TSV based template charts for new posts easily. Automatic showing right data's syntax editor (json/xml). CSV&TSV data sets for multibar. Cooler look of data editor with its new styles.

= 1.5.0 =
Version 1.5.0 -
NEW: Direct data editor for all created own charts automically from gallery that removes itself when you publish. New example from CSV & TSV charts generation calls.

= 1.4.0 =
Version 1.4.0 -
NEW: Expanding input data formats for common CSV and TSV files by supporting them with 3 different chart types (multibar, viewfinder, and simpleline).

= 1.3.1 =
Version 1.3.1 -
Automatic cloning of data sets into blog's root folder when creating new charts from gallery.

= 1.3.0 =
Version 1.3.0 - 
NEW: Charts gallery becomes an automatic chart generating tool for a new post/page. Most gallery demos in XML + perfect functions to convert data between JSON and XML formats.

= 1.2.4 =
Version 1.2.4 - 
Demo charts into 2x6 grid for better room to dislay all with some narrow themes.

= 1.2.3 =
Version 1.2.3 - 
More pretty & helpfull demo charts with titles. New examples how to use XML input files. Tested with the newest WordPress 3.9.

= 1.2.2 =
Version 1.2.2 - 
Better support of XML data format & xml demo mode of whole gallery for testing it.

= 1.2.1 =
Version 1.2.1 - 
NEW: Support of XML data format from input files & demo examples.

= 1.1.1 =
Version 1.1.1 - 
Updating newest d3.js (v3.4.6) in use.

= 1.1.0 =
Version 1.1.0 - 
NEW: direct shortcode API, simple to use + automatic generation of containers.

= 1.0.3 =
Version 1.0.3 - 
Cleaning & reordering of code.

= 1.0.2 =
Version 1.0.2 - 
Minor startup bugs + better readme texts.

= 1.0.0 =
Version 1.0.0 - 
The 1st release of visualisation gallery.

 == Upgrade Notice ==
 
 Goal is to test parallel with 3.3.2 and newest 3.8.1 blogs.
 