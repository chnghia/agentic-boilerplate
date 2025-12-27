from typing import Dict, Any

class PolicyService:
    @staticmethod
    def evaluate_proactive_trigger(event_type: str, context_data: Dict[str, Any]) -> float:
        """
        Evaluate if a proactive trigger should be fired.
        Returns a confidence score (0.0 - 1.0).
        """
        # Placeholder logic
        if event_type == "daily_tick":
            # Example: Always trigger daily log if specific condition met
            return 0.9
        
        return 0.0

    @staticmethod
    def should_emit_prompt_card(confidence: float, threshold: float = 0.7) -> bool:
        return confidence >= threshold
