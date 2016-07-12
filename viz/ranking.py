
import plotly.offline as py
from plotly.graph_objs import Scatter, Layout

py.plot({
    "data": [Scatter(x=[1, 2, 3, 4], y=[4, 3, 2, 1])],
        "layout": Layout(title="hello world")
        })
"""
import plotly 
import plotly.graph_objs as go

data = [go.Bar(
                x=[20, 14, 23],
                            y=['giraffes', 'orangutans', 'monkeys'],
                                        orientation = 'h'
                                        )]

plotly.offline.plot(data, filename='horizontal-bar')
"""
