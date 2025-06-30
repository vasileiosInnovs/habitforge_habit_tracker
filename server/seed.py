from server.app import app, bcrypt
from server.models import *
from faker import Faker
from random import choice, randint, sample

with app.app_context():
    fake = Faker()

    bios = ['Collects rare teas and unfinished journals.','Loves thunderstorms, hates loud typing.', 'Can juggle three oranges but not responsibilities.', 'Obsessed with maps, mushrooms, and metaphors.', 'Plants more succulents than makes sense.', 'Tracks habits religiously but loses socks constantly.', 'Reads Stoic philosophy in a hoodie that says “chaos.”', 'Journals every night, forgets where the journal is.', 'Drinks herbal tea while plotting world domination via to-do lists.', "Visualizes success while petting the neighbor’s cat."]

    passwords = [
    'V3locity@2025',
    'Rise&Sh1ne!',
    'M1ndful#Flow',
    'Hydr8!Now99',
    'Gr8tful$Soul',
    'ZenMaster_82',
    'FocusTime!23',
    'J0urnal$Magic',
    'StretCh&Win7',
    'Read&Lead#10'
    ]

    urls = ['https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg', 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg', 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg', 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg', 'https://images.pexels.com/photos/4519471/pexels-photo-4519471.jpeg', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg']

    db.session.query(Habit).delete()
    db.session.query(User).delete()
    db.session.query(Challenge).delete()
    db.session.commit()

    print('Users...')
    users = []
    for n in range(10):
        password_sec = choice(passwords)
        user = User(username=fake.name(), email=fake.email(),image_url=choice(urls), bio=choice(bios))
        user.password = password_sec
        db.session.add(user)
        users.append(user)
    db.session.commit()

    print('Habits...')
    habit_data = [
        ('Morning Journaling', 'Start each day by writing three thoughts, goals, or reflections.'),
        ('10-Minute Meditation', 'Spend a quiet 10 minutes daily to breathe and focus your mind.'),
        ('Evening Digital Detox', 'Avoid screens for one hour before bed to improve sleep quality.'),
        ('Read 10 Pages', 'Read at least 10 pages from a book of your choice every day.'),
        ('Hydration Check', 'Drink a full glass of water first thing in the morning.'),
        ('Walk After Meals', 'Take a 10–15 minute walk after lunch or dinner for digestion and movement.'),
        ('Gratitude List', "Write down three things you're grateful for every night."),
        ('Stretch in the Morning', 'Start your day with 5 minutes of light stretching to wake up your body.')
    ]

    for user in users:
        num_habits = randint(1, 2)
        chosen_habits = sample(habit_data, num_habits)
        for name, desc in chosen_habits:
            habit = Habit(
                name=name,
                description=desc,
                frequency=choice(['Daily', 'Weekly']),
                completed=choice([True, False]),
                user_id=user.id
            )
            db.session.add(habit)

    db.session.commit()

    print('Challenges...')
    challenges = []
    for title, desc, start, end in [
        ('30-Day Morning Journaling Challenge', 'Commit to journaling...', '2025-07-01', '2025-07-30'),
        ('21-Day Digital Detox Challenge', 'Unplug for at least...', '2025-07-01', '2025-07-21'),
        ('14-Day Cold Shower Challenge', 'Start every day with...', '2025-07-01', '2025-07-14'),
        ('7-Day Evening Reflection Sprint', 'Reflect and journal...', '2025-07-01', '2025-07-07'),
    ]:
        challenge = Challenge(
            title=title,
            description=desc,
            start_date=start,
            end_date=end,
            user_id=choice(users).id
        )
        db.session.add(challenge)
        challenges.append(challenge)

    db.session.commit()

    print('Participations...')
    reasons_for_joining = [
    "To build consistency",
    "Seeking accountability",
    "Joining friends",
    "To improve focus",
    "To try something new",
    "Inspired by success stories",
    "To track my progress",
    "To challenge myself",
    "Looking for motivation",
    "To form healthy habits"
    ]

    personal_goals = [
    "Read 10 pages daily",
    "Exercise 3 times a week",
    "Wake up by 6 AM",
    "Drink 2 liters of water",
    "Write a journal entry each night",
    "Meditate for 10 minutes daily",
    "Run 5 km by end of the month",
    "Cook all meals at home for 2 weeks",
    "Limit phone use to 2 hours/day",
    "Complete 30-day yoga routine"
    ]


    for user in users:
        joined_challenges = sample(challenges, randint(1, 3))
        join_dates = [fake.date_between(start_date='-30d', end_date='today') for _ in range(10)]
        for challenge in joined_challenges:
            participation = Participation(user_id=user.id, challenge_id=challenge.id, reason_for_joining=choice(reasons_for_joining), personal_goal=choice(personal_goals), join_date=choice(join_dates))
            db.session.add(participation)

    db.session.commit()

    print('Successful')