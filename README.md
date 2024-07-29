# narrative-visualization
Visualization Project UIUC CS416 

https://hilda0618.github.io/ 

Introduction:
This narrative visualization leverages interactive and dynamic elements to effectively communicate the relationships between vehicle attributes and fuel efficiency, providing a compelling and educational experience for the user. The website can be accessed at hilda0618.github.io.


Messaging:
The primary message of this narrative visualization is to showcase the relationship between different fuel efficiency metrics (City MPG and Highway MPG) and vehicle attributes (such as the number of engine cylinders and fuel type) in 2017 automobiles. Through interactive charts, the visualization aims to highlight patterns and correlations, enabling users to easily compare the fuel efficiency of various car makes and understand the impact of different engine and fuel types on performance.


Narrative Structure: 
The visualization follows an interactive slideshow structure. This structure allows users to explore different scenes at their own pace by using navigation buttons to move between them. The scenes are designed to build on each other, providing a comprehensive overview of the dataset by gradually introducing more detailed insights.


Visual Structure:
Each scene in the visualization employs a distinct visual structure to ensure clarity and engagement:
-Scatter Plot: The scatter plot displays the relationship between Average City MPG (X-axis) and Average Highway MPG (Y-axis), with circle sizes representing engine cylinders. This visual structure helps viewers quickly grasp the positive correlation between city and highway MPG and identify clusters based on cylinder count.

-Bar Charts: The bar charts for Highway MPG and City MPG by car make provide a clear comparison of fuel efficiency across different makes. The bars are sorted and color-coded for easy visual comparison.

-Cylinder Analysis: The bar chart analyzing City MPG by engine cylinders shows the distribution and efficiency of different cylinder counts, allowing viewers to understand how engine size affects fuel efficiency.


Scenes:  
The visualization consists of four main scenes, ordered to progressively deepen the user's understanding:
-Scatter Plot: Illustrates the overall relationship between City MPG and Highway MPG, highlighting correlations and clusters.

-Highway MPG Overview: Bar chart showing maximum Highway MPG for each car make, facilitating direct comparisons.

-City MPG Overview: Bar chart displaying maximum City MPG for each car make, complementing the Highway MPG overview.

-Impact of Engine Cylinders: Bar chart analyzing average City MPG by cylinder count, showing the performance variations across different engine sizes.


Annotations:  
Annotations are used to support the messaging by highlighting key insights:
-Scatter Plot: An annotation indicates that electric fuel vehicles perform better in overall MPG.

-Highway MPG Overview: An annotation points out that Hyundai has the highest MPG due to electric engines.

-City MPG Overview: An annotation notes that Ferrari has the least efficient city MPG.

-Impact of Engine Cylinders: An annotation highlights that electric cars with zero cylinders perform the best. These annotations are visually consistent, using a distinct font and color to stand out without distracting from the main data.

Parameters:  
The parameters of the narrative visualization include:
-Highway MPG: Represents the maximum highway miles per gallon each car make achieves, used primarily in the highway MPG overview scene to compare performance across different brands.

-City MPG: Represents the maximum city miles per gallon for each car make, highlighted in the city MPG overview to showcase urban fuel efficiency across brands.
    
-Make: The brand or make of the vehicle, which is a categorical parameter used to sort and display data in the bar charts, allowing users to identify trends and performance metrics associated with specific car manufacturers.
    
-Engine Cylinders: Reflects the number of cylinders in a vehicle’s engine, a crucial parameter in analyzing how engine size impacts fuel efficiency, particularly displayed in the scene that assesses the impact of engine cylinders on MPG.


Triggers: 
User actions are connected to changes in the visualization state through event listeners:
-Previous and Next Buttons: Navigate between scenes by updating the current scene index. These affordances ensure that users can intuitively explore the data and understand the available options.


Conclusion: 
By focusing on a sequential exploration of data and providing clear, context-specific annotations and visual cues, this project ensures that viewers can easily follow the logical progression of information and gain a comprehensive understanding of the dataset. 
