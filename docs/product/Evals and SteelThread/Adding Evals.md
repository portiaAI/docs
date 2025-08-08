---
sidebar_position: 5
slug: /adding-evals
---

# 🆕 Adding Evals

## 💻 Through the UI

Adding Evals is easy through the Portia UI. 


Eval Test cases are designed to be generated from existing data making it easy to do. You can also create a new test case from blank though if you'd like to!

![Wizard One](/img/wizard_1.png)

Step one of the process is about specifying the input to Portia. Either a query or an existing plan can be provided depending on your use case.

![Wizard Two](/img/wizard_2.png)

Step two involves the assertions that we will make when the plan_run is complete. This allows you to use the built in evaluators or to use custom tags.

![Wizard Three](/img/wizard_3.png)

Finally give the test case a description to make it easy to understand whats going on it in.

![Wizard Four](/img/wizard_4.png)



## Evals + Custom Evaluators

Lets imagine we want to write an evaluator that looks at the tone of the final output. 

We can add a custom assertion to each test case specifying what tone we expect:

![Wizard Five](/img/wizard_5.png)

And then write a custom evaluator to use this tag and calculate the metrics:

```python
from portia import Plan, PlanRun

from steelthread.evals import EvalMetric, EvalTestCase, Evaluator, PlanRunMetadata


class ToneEvaluator(Evaluator):
    """Evaluator that scores on tone."""

    def evaluate_tone(self, expected_tone: str, string_to_score:str)-> float:
        # implement this using whatever mechanism you'd like
        return 1

    def eval_test_case(
        self,
        test_case: EvalTestCase,
        final_plan: Plan,  # noqa: ARG002
        final_plan_run: PlanRun,
        additional_data: PlanRunMetadata,  # noqa: ARG002
    ) -> list[EvalMetric] | EvalMetric | None:
        """Score plan run outputs based on whether the tone matches."""
        expected_tone = test_case.get_custom_assertion("expected_tone")

        # exit early if test case doesn't have annotation.
        if not expected_tone:
            return None

        string_to_score = (
            f"{final_plan_run.outputs.final_output.get_value()}"
            if final_plan_run.outputs.final_output
            else ""
        )

        score = self.evaluate_tone(expected_tone, string_to_score)

        return EvalMetric.from_test_case(
            test_case=test_case,
            score=score,
            name="expected_tone",
            description="Scores highly when tone is as expected",
            expectation=expected_tone,
        )
```