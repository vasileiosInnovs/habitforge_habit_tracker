from app import app
from models import *
from faker import Faker
from random import choice, randint, random, sample

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
        user = User(username=fake.name(), email=fake.email(), password=fake.password(),url=choice(urls), bio=choice(bios))
        password = choice(passwords)
        user.password = password
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
      num_habits = randint(1, 3)
      chosen_habits = sample(habit_data, num_habits)
      for name, desc in chosen_habits:
          habit = Habit(
              name=name,
              description=desc,
              frequency=randint(5, 50),
              user_id=user.id
          )
          db.session.add(habit)

    db.session.commit()

    print('Challenges...')
    challenges = [
        Challenge(title='30-Day Morning Journaling Challenge', description='Commit to journaling each morning for 30 days to build clarity, gratitude, and focus before your day begins.', start_date='2025-07-01', end_date='2025-07-30'),
        Challenge(title='21-Day Digital Detox Challenge', description='Unplug for at least one hour each day — no social media, no screens — and reclaim your attention and peace of mind.', start_date='2025-07-01', end_date='2025-07-21'),
        Challenge(title='14-Day Cold Shower Challenge', description='Start every day with a 30-second cold shower to train your mind to embrace discomfort and build discipline.', start_date='2025-07-01', end_date='2025-07-14'),
        Challenge(title='7-Day Evening Reflection Sprint', description='Reflect and journal for 5 - 10 minutes each night for one week to improve self-awareness and decision-making.', start_date='2025-07-01', end_date='2025-07-07')
    ]
    
    db.session.add_all(challenges)
    db.session.commit()

    print('Participations...')
    for user in users:
        joined_challenges = sample(challenges, randint(1, 3))
        for challenge in joined_challenges:
            participation = Participation(user_id=user.id, challenge_id=challenge.id)
            db.session.add(participation)

    db.session.commit()

    print('Successful')