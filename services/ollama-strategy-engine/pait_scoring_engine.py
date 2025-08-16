import json
from datetime import datetime, timedelta
import math

class PaitScoringEngine:
    """pAIt Rating System - Proof of Work AI-powered scoring with dual scoring"""
    
    def __init__(self):
        # Core scoring factors with weights (total = 1000 raw points)
        self.core_factors = {
            "performance": {
                "weight": 350,  # 35% of 1000
                "subfactors": {
                    "monthly_return": 150,
                    "consistency": 100,
                    "risk_adjusted_return": 100
                }
            },
            "social_acceleration": {
                "weight": 250,  # 25% of 1000
                "subfactors": {
                    "media_exposure": 100,
                    "social_engagement": 80,
                    "commentary_frequency": 70
                }
            },
            "strategy_quality": {
                "weight": 200,  # 20% of 1000
                "subfactors": {
                    "innovation": 80,
                    "repeatability": 60,
                    "risk_management": 60
                }
            },
            "proof_of_work": {
                "weight": 200,  # 20% of 1000
                "subfactors": {
                    "track_record": 100,
                    "transparency": 50,
                    "verification": 50
                }
            }
        }
        
        # Data completeness requirements for each factor
        self.completeness_requirements = {
            "performance": ["monthlyReturn", "avg24Month", "strategyConsistency", "riskManagement"],
            "social_acceleration": ["cnbcAppearances", "publicStatements", "lastUpdated"],
            "strategy_quality": ["focus", "strategyConsistency", "riskManagement"],
            "proof_of_work": ["avg24Month", "portfolioHoldings", "recentMoves"]
        }
        
        # Acceleration rates for social factors
        self.acceleration_rates = {
            "media_exposure": {
                "cnbc_appearance": 2.0,      # 2x multiplier
                "interview": 1.5,            # 1.5x multiplier
                "social_media_post": 1.2,    # 1.2x multiplier
                "earnings_call": 1.8         # 1.8x multiplier
            },
            "social_engagement": {
                "high_engagement": 1.5,      # 1.5x multiplier
                "viral_content": 2.0,        # 2x multiplier
                "community_response": 1.3    # 1.3x multiplier
            },
            "commentary_frequency": {
                "daily_updates": 1.4,        # 1.4x multiplier
                "weekly_analysis": 1.2,      # 1.2x multiplier
                "monthly_reports": 1.0       # 1.0x multiplier
            }
        }
    
    def calculate_performance_score(self, data):
        """Calculate performance score (0-100) for breakdown"""
        score = 0
        
        # Monthly return scoring (0-15 points)
        if 'monthlyReturn' in data and data['monthlyReturn'] is not None:
            monthly_return = abs(data['monthlyReturn'])
            if monthly_return >= 20:
                score += 15
            elif monthly_return >= 15:
                score += 12
            elif monthly_return >= 10:
                score += 9
            elif monthly_return >= 5:
                score += 6
            else:
                score += 3
        
        # Consistency scoring (0-10 points)
        if 'strategyConsistency' in data and data['strategyConsistency'] is not None:
            score += (data['strategyConsistency'] / 100) * 10
        
        # Risk-adjusted return (0-10 points)
        if 'riskManagement' in data and data['riskManagement'] is not None:
            score += (data['riskManagement'] / 100) * 10
        
        return min(score, 35)
    
    def calculate_social_acceleration_score(self, data):
        """Calculate social acceleration score (0-100) for breakdown"""
        score = 0
        acceleration_multiplier = 1.0
        
        # Media exposure (0-10 points)
        if 'cnbcAppearances' in data and data['cnbcAppearances']:
            appearances = len(data['cnbcAppearances'])
            base_score = min(appearances * 2, 10)  # 2 points per appearance, max 10
            acceleration_multiplier *= self.acceleration_rates['media_exposure']['cnbc_appearance']
            score += base_score
        
        # Social engagement (0-8 points)
        if 'publicStatements' in data and data['publicStatements']:
            statements = len(data['publicStatements'])
            base_score = min(statements * 1.5, 8)  # 1.5 points per statement, max 8
            score += base_score
        
        # Commentary frequency (0-7 points)
        if 'lastUpdated' in data:
            try:
                last_update = datetime.fromisoformat(data['lastUpdated'].replace('Z', '+00:00'))
                days_since = (datetime.now() - last_update).days
                if days_since <= 1:
                    score += 7 * self.acceleration_rates['commentary_frequency']['daily_updates']
                elif days_since <= 7:
                    score += 5 * self.acceleration_rates['commentary_frequency']['weekly_analysis']
                elif days_since <= 30:
                    score += 3 * self.acceleration_rates['commentary_frequency']['monthly_reports']
            except:
                score += 3
        
        # Apply acceleration multiplier
        final_score = score * acceleration_multiplier
        return min(final_score, 25)
    
    def calculate_strategy_quality_score(self, data):
        """Calculate strategy quality score (0-100) for breakdown"""
        score = 0
        
        # Innovation (0-8 points)
        if 'focus' in data:
            focus = data['focus'].lower()
            if 'ai' in focus or 'innovation' in focus or 'disruptive' in focus:
                score += 8
            elif 'technology' in focus or 'growth' in focus:
                score += 6
            elif 'value' in focus or 'dividend' in focus:
                score += 4
            else:
                score += 2
        
        # Repeatability (0-6 points)
        if 'strategyConsistency' in data and data['strategyConsistency'] is not None:
            score += (data['strategyConsistency'] / 100) * 6
        
        # Risk management (0-6 points)
        if 'riskManagement' in data and data['riskManagement'] is not None:
            score += (data['riskManagement'] / 100) * 6
        
        return min(score, 20)
    
    def calculate_proof_of_work_score(self, data):
        """Calculate proof of work score (0-100) for breakdown"""
        score = 0
        
        # Track record (0-10 points)
        if 'avg24Month' in data and data['avg24Month'] is not None:
            avg_return = abs(data['avg24Month'])
            if avg_return >= 25:
                score += 10
            elif avg_return >= 20:
                score += 8
            elif avg_return >= 15:
                score += 6
            elif avg_return >= 10:
                score += 4
            else:
                score += 2
        
        # Transparency (0-5 points)
        if 'portfolioHoldings' in data and data['portfolioHoldings']:
            holdings_count = len(data['portfolioHoldings'])
            score += min(holdings_count * 0.5, 5)  # 0.5 points per holding, max 5
        
        # Verification (0-5 points)
        if 'recentMoves' in data and data['recentMoves']:
            moves_count = len(data['recentMoves'])
            score += min(moves_count * 0.5, 5)  # 0.5 points per move, max 5
        
        return min(score, 20)
    
    def calculate_data_completeness(self, data):
        """Calculate how complete the data is for scoring (0-100%)"""
        total_required = 0
        total_available = 0
        
        for factor, required_fields in self.completeness_requirements.items():
            for field in required_fields:
                total_required += 1
                if field in data and data[field] is not None:
                    # Check if the field has meaningful data
                    if isinstance(data[field], (list, dict)) and len(data[field]) > 0:
                        total_available += 1
                    elif isinstance(data[field], (int, float)) and data[field] != 0:
                        total_available += 1
                    elif isinstance(data[field], str) and data[field].strip():
                        total_available += 1
        
        completeness_percentage = (total_available / total_required) * 100 if total_required > 0 else 0
        return round(completeness_percentage, 1)
    
    def calculate_raw_score(self, data):
        """Calculate raw score (0-1000) based on available data"""
        raw_score = 0
        
        # Performance scoring (0-350 points)
        if 'monthlyReturn' in data and data['monthlyReturn'] is not None:
            monthly_return = abs(data['monthlyReturn'])
            if monthly_return >= 20:
                raw_score += 150
            elif monthly_return >= 15:
                raw_score += 120
            elif monthly_return >= 10:
                raw_score += 90
            elif monthly_return >= 5:
                raw_score += 60
            else:
                raw_score += 30
        
        if 'strategyConsistency' in data and data['strategyConsistency'] is not None:
            raw_score += (data['strategyConsistency'] / 100) * 100
        
        if 'riskManagement' in data and data['riskManagement'] is not None:
            raw_score += (data['riskManagement'] / 100) * 100
        
        # Social acceleration scoring (0-250 points)
        if 'cnbcAppearances' in data and data['cnbcAppearances']:
            appearances = len(data['cnbcAppearances'])
            base_score = min(appearances * 20, 100)  # 20 points per appearance, max 100
            acceleration_multiplier = self.acceleration_rates['media_exposure']['cnbc_appearance']
            raw_score += base_score * acceleration_multiplier
        
        if 'publicStatements' in data and data['publicStatements']:
            statements = len(data['publicStatements'])
            base_score = min(statements * 15, 80)  # 15 points per statement, max 80
            raw_score += base_score
        
        # Strategy quality scoring (0-200 points)
        if 'focus' in data:
            focus = data['focus'].lower()
            if 'ai' in focus or 'innovation' in focus or 'disruptive' in focus:
                raw_score += 80
            elif 'technology' in focus or 'growth' in focus:
                raw_score += 60
            elif 'value' in focus or 'dividend' in focus:
                raw_score += 40
            else:
                raw_score += 20
        
        if 'strategyConsistency' in data and data['strategyConsistency'] is not None:
            raw_score += (data['strategyConsistency'] / 100) * 60
        
        if 'riskManagement' in data and data['riskManagement'] is not None:
            raw_score += (data['riskManagement'] / 100) * 60
        
        # Proof of work scoring (0-200 points)
        if 'avg24Month' in data and data['avg24Month'] is not None:
            avg_return = abs(data['avg24Month'])
            if avg_return >= 25:
                raw_score += 100
            elif avg_return >= 20:
                raw_score += 80
            elif avg_return >= 15:
                raw_score += 60
            elif avg_return >= 10:
                raw_score += 40
            else:
                raw_score += 20
        
        if 'portfolioHoldings' in data and data['portfolioHoldings']:
            holdings_count = len(data['portfolioHoldings'])
            raw_score += min(holdings_count * 5, 50)  # 5 points per holding, max 50
        
        if 'recentMoves' in data and data['recentMoves']:
            moves_count = len(data['recentMoves'])
            raw_score += min(moves_count * 5, 50)  # 5 points per move, max 50
        
        return min(round(raw_score), 1000)
    
    def calculate_normalized_rating(self, raw_score, completeness_percentage):
        """Calculate normalized rating (0-500) based on data completeness"""
        # Normalize the raw score to a 500-point scale
        normalized_score = (raw_score / 1000) * 500
        
        # Apply completeness penalty for missing data
        completeness_penalty = (100 - completeness_percentage) * 0.5  # 0.5 point penalty per % missing
        
        final_rating = max(0, normalized_score - completeness_penalty)
        return round(final_rating, 1)
    
    def get_rating_grade(self, normalized_rating):
        """Convert normalized rating to letter grade"""
        if normalized_rating >= 450:
            return "A+ (Legendary)"
        elif normalized_rating >= 400:
            return "A (Elite)"
        elif normalized_rating >= 350:
            return "B+ (Professional)"
        elif normalized_rating >= 300:
            return "B (Competent)"
        elif normalized_rating >= 250:
            return "C+ (Developing)"
        elif normalized_rating >= 200:
            return "C (Novice)"
        else:
            return "D (Insufficient Data)"
    
    def get_acceleration_factors(self, data):
        """Identify factors that accelerate the score"""
        factors = []
        
        if 'cnbcAppearances' in data and data['cnbcAppearances']:
            factors.append(f"CNBC appearances: {len(data['cnbcAppearances'])} (2x multiplier)")
        
        if 'publicStatements' in data and data['publicStatements']:
            factors.append(f"Public statements: {len(data['publicStatements'])} (1.5x multiplier)")
        
        if 'portfolioHoldings' in data and len(data['portfolioHoldings']) > 5:
            factors.append("High portfolio transparency (bonus points)")
        
        return factors
    
    def assess_data_quality(self, completeness_percentage, raw_score):
        """Assess the quality and reliability of the data"""
        if completeness_percentage >= 90 and raw_score >= 800:
            return "Excellent - High confidence in scoring"
        elif completeness_percentage >= 80 and raw_score >= 600:
            return "Good - Reliable scoring with minor gaps"
        elif completeness_percentage >= 70 and raw_score >= 400:
            return "Fair - Moderate confidence, some data missing"
        elif completeness_percentage >= 60 and raw_score >= 200:
            return "Limited - Low confidence, significant gaps"
        else:
            return "Poor - Insufficient data for reliable scoring"
    
    def get_recommendations(self, raw_score, completeness_percentage, data):
        """Generate improvement recommendations based on dual scoring"""
        recommendations = []
        
        # Data completeness recommendations
        if completeness_percentage < 80:
            recommendations.append(f"Improve data completeness (currently {completeness_percentage}%)")
            recommendations.append("Collect missing performance metrics and strategy details")
        
        # Raw score recommendations
        if raw_score < 600:
            recommendations.append("Focus on improving core performance metrics")
            recommendations.append("Increase media exposure and public commentary")
            recommendations.append("Build longer track record with proven results")
        
        if raw_score >= 800:
            recommendations.append("Maintain current performance levels")
            recommendations.append("Consider expanding into new markets/strategies")
            recommendations.append("Share insights to build community engagement")
        
        return recommendations
    
    def generate_pait_report(self, data):
        """Generate detailed pAIt analysis report with dual scoring"""
        
        # Calculate all metrics
        raw_score = self.calculate_raw_score(data)
        completeness_percentage = self.calculate_data_completeness(data)
        normalized_rating = self.calculate_normalized_rating(raw_score, completeness_percentage)
        rating_grade = self.get_rating_grade(normalized_rating)
        
        # Calculate factor breakdowns
        breakdown = {
            "performance": self.calculate_performance_score(data),
            "social_acceleration": self.calculate_social_acceleration_score(data),
            "strategy_quality": self.calculate_strategy_quality_score(data),
            "proof_of_work": self.calculate_proof_of_work_score(data)
        }
        
        report = {
            "raw_score": raw_score,
            "max_raw_score": 1000,
            "completeness_percentage": completeness_percentage,
            "normalized_rating": normalized_rating,
            "max_normalized_rating": 500,
            "rating_grade": rating_grade,
            "breakdown": breakdown,
            "acceleration_factors": self.get_acceleration_factors(data),
            "recommendations": self.get_recommendations(raw_score, completeness_percentage, data),
            "data_quality_assessment": self.assess_data_quality(completeness_percentage, raw_score),
            "calculated_at": datetime.now().isoformat()
        }
        
        return report

# Test the enhanced scoring engine
if __name__ == "__main__":
    engine = PaitScoringEngine()
    
    # Test with sample data
    test_data = {
        "monthlyReturn": 15.5,
        "avg24Month": 22.3,
        "strategyConsistency": 85,
        "riskManagement": 78,
        "focus": "AI and Disruptive Innovation",
        "cnbcAppearances": [
            {"show": "Squawk Box", "date": "2025-01-15"},
            {"show": "Mad Money", "date": "2025-01-12"}
        ],
        "publicStatements": [
            {"statement": "AI revolution", "date": "2025-01-14"},
            {"statement": "Bitcoin adoption", "date": "2025-01-13"}
        ],
        "portfolioHoldings": [
            {"symbol": "PLTR", "weight": 8.5},
            {"symbol": "TSLA", "weight": 7.2},
            {"symbol": "COIN", "weight": 4.1}
        ],
        "recentMoves": [
            {"action": "Increased PLTR", "date": "2025-01-15"},
            {"action": "Reduced TSLA", "date": "2025-01-12"}
        ],
        "lastUpdated": datetime.now().isoformat()
    }
    
    report = engine.generate_pait_report(test_data)
    
    print("🎯 Enhanced pAIt Scoring Engine Test")
    print("=" * 60)
    print(f"Raw Score: {report['raw_score']}/1000")
    print(f"Data Completeness: {report['completeness_percentage']}%")
    print(f"Normalized Rating: {report['normalized_rating']}/500")
    print(f"Grade: {report['rating_grade']}")
    print(f"Data Quality: {report['data_quality_assessment']}")
    
    print(f"\nBreakdown:")
    for factor, score in report['breakdown'].items():
        print(f"  {factor.replace('_', ' ').title()}: {score}")
    
    print(f"\nAcceleration Factors:")
    for factor in report['acceleration_factors']:
        print(f"  • {factor}")
    
    print(f"\nRecommendations:")
    for rec in report['recommendations']:
        print(f"  • {rec}")