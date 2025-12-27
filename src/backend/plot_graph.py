"""Script to visualize the LangGraph orchestrator."""

from app.agents.orchestrator import get_orchestrator_graph

graph = get_orchestrator_graph()

# Export as PNG using mermaid
png_data = graph.get_graph().draw_mermaid_png()

with open('orchestrator_graph.png', 'wb') as f:
    f.write(png_data)

print('Graph saved to orchestrator_graph.png')
