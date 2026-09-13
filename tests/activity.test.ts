import { expect, test } from '~test/fixtures';
import { CardPageActivity } from '~test/helpers/CardPageActivity';

test.describe('Activity', () => {
  let cardPage: CardPageActivity;

  test.beforeEach(async ({ page, request }) => {
    cardPage = new CardPageActivity(page, request);
  });

  test.describe.configure({ timeout: 60_000 });

  test('adds a comment in the activity column', async () => {
    await cardPage.setupActivity();
    await cardPage.addComment('Looks good');
  });

  test('keeps a comment being written while the entries load', async () => {
    await cardPage.setupActivity();

    await cardPage.waitForInteractiveTrigger(
      '[data-testid="AddCommentInput"]',
      '[data-testid="AddCommentTrigger"]',
    );

    const input = cardPage.page.getByTestId('AddCommentInput');
    await input.fill('Half-written thought');

    await expect(
      cardPage.page.getByTestId('ActivityCommentContent'),
    ).toHaveCount(0);
    await cardPage.page.waitForLoadState('networkidle');

    await expect(input).toHaveText('Half-written thought');
    await expect(
      cardPage.page.locator(
        '[data-testid="SaveCommentButton"]:not([disabled])',
      ),
    ).toBeVisible();
  });

  test('edits a comment in the activity column', async () => {
    await cardPage.setupActivity();
    const commentContainer = await cardPage.addComment('Looks good');

    await expect(async () => {
      const editInput = commentContainer.getByTestId('AddCommentInput');
      if ((await editInput.count()) > 0) {
        return;
      }

      await commentContainer.getByTestId('EditCommentLink').click();
      await expect(editInput).toBeVisible();
    }).toPass();

    await commentContainer
      .getByTestId('AddCommentInput')
      .fill('Needs revision');

    await cardPage.waitForSaveButton(commentContainer);

    await expect(
      commentContainer.getByTestId('ActivityCommentContent'),
    ).toHaveText('Needs revision');
  });

  test('deletes a comment in the activity column', async () => {
    await cardPage.setupActivity();
    await cardPage.addComment('Looks good');

    await cardPage.waitForInteractiveTrigger(
      '[data-testid="PopoverOptionsContent"]',
      '[data-testid="ActivityCommentContainer"] [data-testid="DeleteCommentLink"]',
    );

    await cardPage.page
      .getByTestId('DeleteChecklistPopoverButton')
      .filter({ hasText: /^Delete$/ })
      .click();

    await expect(
      cardPage.page.getByTestId('ActivityCommentContent'),
    ).toHaveCount(0);
  });
});

test.describe('Activity details toggle', () => {
  let cardPage: CardPageActivity;

  test.beforeEach(async ({ page, request }) => {
    cardPage = new CardPageActivity(page, request);
  });

  test.describe.configure({ timeout: 60_000 });

  test('persists hidden details across a reload', async () => {
    await cardPage.setupSeededActivity();

    const activityColumn = cardPage.page.getByTestId('CardActivityColumn');
    const toggleButton = activityColumn.getByTestId('HideActivityButton');
    const newerEntry = cardPage.activityEntry('seeded activity 1');
    const firstEntry = cardPage.activityEntry('seeded activity 2');

    await expect(toggleButton).toHaveText('Hide details');
    await expect(newerEntry).toBeVisible();

    await cardPage.hideDetails();

    // The toggle is written to the card, so let the mutation reach the server
    // before dropping the optimistic cache on the floor with a reload.
    await cardPage.page.waitForLoadState('networkidle');
    await cardPage.page.reload();

    await expect(toggleButton).toHaveText('Show details');
    await expect(newerEntry).toHaveCount(0);
    await expect(firstEntry).toBeVisible();
  });

  test('always shows the card creation entry', async () => {
    const { board } = await cardPage.seedCard();
    await cardPage.page.goto(`/board/${board.id}`);

    await cardPage.waitForInteractiveTrigger(
      '[data-testid="AddCardInput"]',
      '[data-testid="AddCardText"]',
    );
    await cardPage.page.getByTestId('AddCardInput').fill('Write E2E tests');
    await cardPage.page.getByTestId('AddCardButton').click();

    const newCard = cardPage.page
      .getByTestId('ListCardContainer')
      .filter({ hasText: 'Write E2E tests' });

    await expect(newCard).toBeVisible();
    // The creation entry is written by an effect after the card lands, so let
    // it reach the server before the card modal fetches the feed.
    await cardPage.page.waitForLoadState('networkidle');

    await cardPage.waitForHydratedAction(
      () => newCard.click(),
      () => cardPage.page.getByTestId('CardModalContent').isVisible(),
    );

    // A second feed entry, newer than the creation entry, to show that hiding
    // details takes the rest of the feed away and keeps only the pinned one.
    const completionCircle = cardPage.modalCompletionCircle();

    await cardPage.waitForHydratedAction(
      () => completionCircle.click(),
      async () =>
        (await completionCircle.getAttribute('data-completed')) === '',
    );

    const creationEntry = cardPage.activityEntry('added this card');
    const completionEntry = cardPage.activityEntry('marked this card complete');

    await expect(creationEntry).toBeVisible();
    await expect(completionEntry).toBeVisible();

    await cardPage.hideDetails();

    await expect(completionEntry).toHaveCount(0);
    await expect(creationEntry).toBeVisible();
  });
});

test.describe('Activity copy link', () => {
  let cardPage: CardPageActivity;

  test.beforeEach(async ({ page, request }) => {
    cardPage = new CardPageActivity(page, request);
  });

  // openCard + addComment on a cold run can exceed the default 30s budget.
  test.describe.configure({ timeout: 60_000 });

  test('shows the paperclip when hovering the timestamp', async () => {
    await cardPage.installClipboardSpy();
    await cardPage.setupActivity();

    const commentContainer = await cardPage.addComment('Looks good');
    const timestamp = commentContainer.getByTestId('CommentTimestamp');
    const paperclip = commentContainer.getByTestId('PaperclipReveal');

    await expect(paperclip).toHaveAttribute('aria-hidden', 'true');

    await timestamp.hover();

    await expect(paperclip).toHaveAttribute('aria-hidden', 'false');

    // Moving away from the timestamp hides it again.
    await commentContainer.getByTestId('ActivityCommentContent').hover();

    await expect(paperclip).toHaveAttribute('aria-hidden', 'true');
  });

  test('copies the activity url and shows the checkmark on click', async () => {
    await cardPage.installClipboardSpy();
    const { card } = await cardPage.setupActivity();

    const commentContainer = await cardPage.addComment('Looks good');

    await commentContainer.getByTestId('CommentTimestamp').click();

    await expect(
      commentContainer.getByTestId('ActivityCopiedCheckmark'),
    ).toBeVisible();

    const copied = await cardPage.readCopiedText();
    expect(copied).toContain(`/card/${card.id.slice(0, 8)}#activity-`);
  });

  test('navigating to the copied url reveals the activity entry', async () => {
    await cardPage.installClipboardSpy();
    await cardPage.setupActivity();

    const commentContainer = await cardPage.addComment('Looks good');

    await commentContainer.getByTestId('CommentTimestamp').click();

    await expect(
      commentContainer.getByTestId('ActivityCopiedCheckmark'),
    ).toBeVisible();

    const copied = await cardPage.readCopiedText();
    expect(copied).not.toEqual('');

    // Visit the copied link directly as a fresh navigation.
    await cardPage.page.goto(copied);

    const linkedComment = cardPage.page
      .getByTestId('ActivityContainer')
      .filter({ hasText: 'Looks good' });

    await expect(async () => {
      await expect(
        linkedComment.getByTestId('ActivityCommentContent'),
      ).toBeVisible();
      await expect(linkedComment).toBeInViewport();
    }).toPass();
  });

  test('deep links to an entry beyond the first page of activities', async () => {
    const { target } = await cardPage.setupDeepLinks();

    const linkedComment = cardPage.page
      .getByTestId('ActivityContainer')
      .filter({ hasText: target.content });

    await expect(async () => {
      await expect(
        linkedComment.getByTestId('ActivityCommentContent'),
      ).toBeVisible();
      await expect(linkedComment).toBeInViewport();
    }).toPass();
  });
});
