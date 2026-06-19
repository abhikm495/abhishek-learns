/**
 * Generates scripts/seed-data.json with all DSA patterns and questions.
 * Run: node scripts/build-seed-data.js
 */

const fs = require("fs");
const path = require("path");

/** @param {number} id @param {string} slug @param {string} title @param {'easy'|'medium'|'hard'} difficulty @param {string[]} tags */
function q(id, slug, title, difficulty, tags = []) {
  return {
    slug,
    title,
    difficulty,
    links: [
      {
        platform: "leetcode",
        url: `https://leetcode.com/problems/${slug}/`,
        externalId: String(id),
      },
    ],
    tags,
    solutions: [],
  };
}

/** @param {string} slug @param {string} title @param {string} gfgPath */
function qGfg(id, slug, title, difficulty, gfgPath, tags = []) {
  const question = q(id, slug, title, difficulty, tags);
  question.links.push({
    platform: "gfg",
    url: `https://www.geeksforgeeks.org/${gfgPath}/`,
  });
  return question;
}

const twoSumIISolutions = [
  {
    approach: "brute",
    title: "Brute Force — Check All Pairs",
    explanation: "Try every pair (i, j) and check if numbers[i] + numbers[j] == target.",
    code: `class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int n = numbers.size();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (numbers[i] + numbers[j] == target) {
                    return {i + 1, j + 1};
                }
            }
        }
        return {};
    }
};`,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    order: 0,
  },
  {
    approach: "optimal",
    title: "Two Pointers — Optimal",
    explanation:
      "Place left at start and right at end. If sum is too small, move left right; if too large, move right left.",
    code: `class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int left = 0, right = numbers.size() - 1;
        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) return {left + 1, right + 1};
            if (sum < target) left++;
            else right--;
        }
        return {};
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    order: 1,
  },
];

const threeSumSolutions = [
  {
    approach: "brute",
    title: "Brute Force — Three Nested Loops",
    explanation: "Check all triplets (i, j, k) where i < j < k.",
    code: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        set<vector<int>> result;
        int n = nums.size();
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                for (int k = j + 1; k < n; k++)
                    if (nums[i] + nums[j] + nums[k] == 0)
                        result.insert({nums[i], nums[j], nums[k]});
        return vector<vector<int>>(result.begin(), result.end());
    }
};`,
    timeComplexity: "O(n³)",
    spaceComplexity: "O(n)",
    order: 0,
  },
  {
    approach: "optimal",
    title: "Sort + Two Pointers",
    explanation:
      "Sort array. Fix index i, then use two pointers on the remaining subarray to find pairs summing to -nums[i].",
    code: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> result;
        int n = nums.size();
        for (int i = 0; i < n - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1, right = n - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    result.push_back({nums[i], nums[left], nums[right]});
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++; right--;
                } else if (sum < 0) left++;
                else right--;
            }
        }
        return result;
    }
};`,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1) excluding output",
    order: 1,
  },
];

const longestSubstringSolutions = [
  {
    approach: "brute",
    title: "Brute Force — Check All Substrings",
    explanation: "Generate every substring and check if all characters are unique.",
    code: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int maxLen = 0, n = s.size();
        for (int i = 0; i < n; i++)
            for (int j = i; j < n; j++) {
                vector<bool> seen(128, false);
                bool ok = true;
                for (int k = i; k <= j; k++) {
                    if (seen[s[k]]) { ok = false; break; }
                    seen[s[k]] = true;
                }
                if (ok) maxLen = max(maxLen, j - i + 1);
            }
        return maxLen;
    }
};`,
    timeComplexity: "O(n³)",
    spaceComplexity: "O(min(n, charset))",
    order: 0,
  },
  {
    approach: "optimal",
    title: "Sliding Window with Hash Map",
    explanation:
      "Expand window with right pointer. If duplicate found, shrink from left until duplicate is removed.",
    code: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> lastSeen;
        int left = 0, maxLen = 0;
        for (int right = 0; right < (int)s.size(); right++) {
            if (lastSeen.count(s[right]))
                left = max(left, lastSeen[s[right]] + 1);
            lastSeen[s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(n, charset))",
    order: 1,
  },
];

const patterns = [
  {
    slug: "two-pointers",
    title: "Two Pointers",
    description:
      "Use two indices moving toward each other or in the same direction on sorted arrays or strings.",
    whenToUse: ["Sorted arrays", "Pair sums", "In-place rearrangement", "Palindrome checks"],
    order: 1,
    useCases: [
      {
        title: "Merge sorted log streams",
        description:
          "When merging two sorted audit logs by timestamp, two pointers walk each stream without re-sorting.",
        techExample:
          "Used in log aggregation pipelines (Splunk, ELK) when combining sorted shard outputs.",
        companyOrProduct: "Splunk",
      },
      {
        title: "Deduplicate sorted IDs",
        description:
          "Database cursors over sorted primary keys use two-pointer logic to find unique vs duplicate ranges.",
        techExample: "Batch dedup in ETL jobs reading sorted CSV exports from relational DBs.",
        companyOrProduct: "PostgreSQL",
      },
    ],
    questions: [
      Object.assign(
        qGfg(167, "two-sum-ii-input-array-is-sorted", "Two Sum II", "medium", "two-sum-ii-input-array-is-sorted", [
          "array",
          "two-pointers",
        ]),
        { order: 1, solutions: twoSumIISolutions }
      ),
      Object.assign(q(26, "remove-duplicates-from-sorted-array", "Remove Duplicates from Sorted Array", "easy", ["array"]), {
        order: 2,
      }),
      Object.assign(q(977, "squares-of-a-sorted-array", "Squares of a Sorted Array", "easy", ["array"]), { order: 3 }),
      Object.assign(
        qGfg(15, "3sum", "3Sum", "medium", "find-triplets-array-whose-sum-equal-zero", ["array", "two-pointers"]),
        { order: 4, solutions: threeSumSolutions }
      ),
      Object.assign(q(11, "container-with-most-water", "Container With Most Water", "medium", ["array"]), { order: 5 }),
      Object.assign(q(42, "trapping-rain-water", "Trapping Rain Water", "hard", ["array"]), { order: 6 }),
      Object.assign(q(75, "sort-colors", "Sort Colors", "medium", ["array"]), { order: 7 }),
      Object.assign(q(125, "valid-palindrome", "Valid Palindrome", "easy", ["string"]), { order: 8 }),
    ],
  },
  {
    slug: "sliding-window",
    title: "Sliding Window",
    description:
      "Maintain a window over contiguous subarrays/substrings and slide it while tracking constraints.",
    whenToUse: ["Subarray sum constraints", "Longest substring", "Fixed/variable window size"],
    order: 2,
    useCases: [
      {
        title: "Rate limiting",
        description: "Sliding window counters track requests in the last N seconds for API throttling.",
        techExample: "Redis INCR with TTL or token bucket implementations in API gateways.",
        companyOrProduct: "Redis / Kong",
      },
      {
        title: "Streaming analytics",
        description: "Compute rolling averages or counts over the last K events in real-time pipelines.",
        techExample: "Kafka windowed aggregations and Flink tumbling/sliding windows.",
        companyOrProduct: "Apache Flink",
      },
    ],
    questions: [
      Object.assign(q(643, "maximum-average-subarray-i", "Maximum Average Subarray I", "easy", ["array"]), { order: 1 }),
      Object.assign(
        qGfg(
          3,
          "longest-substring-without-repeating-characters",
          "Longest Substring Without Repeating Characters",
          "medium",
          "length-of-the-longest-substring-without-repeating-characters",
          ["string", "sliding-window"]
        ),
        { order: 2, solutions: longestSubstringSolutions }
      ),
      Object.assign(q(209, "minimum-size-subarray-sum", "Minimum Size Subarray Sum", "medium", ["array"]), { order: 3 }),
      Object.assign(q(567, "permutation-in-string", "Permutation in String", "medium", ["string"]), { order: 4 }),
      Object.assign(
        q(424, "longest-repeating-character-replacement", "Longest Repeating Character Replacement", "medium", ["string"]),
        { order: 5 }
      ),
      Object.assign(q(904, "fruit-into-baskets", "Fruit Into Baskets", "medium", ["array"]), { order: 6 }),
      Object.assign(q(713, "subarray-product-less-than-k", "Subarray Product Less Than K", "medium", ["array"]), {
        order: 7,
      }),
      Object.assign(q(76, "minimum-window-substring", "Minimum Window Substring", "hard", ["string"]), { order: 8 }),
    ],
  },
  {
    slug: "fast-slow-pointers",
    title: "Fast & Slow Pointers",
    description: "Two pointers moving at different speeds for cycle detection and middle-finding.",
    whenToUse: ["Cycle detection", "Middle of linked list", "Happy number"],
    order: 3,
    useCases: [
      {
        title: "Distributed cycle detection",
        description:
          "Floyd's algorithm detects cycles in linked structures — analogous to deadlock detection in wait-for graphs.",
        techExample: "JVM thread dump analysis and resource leak detection in long-running services.",
      },
    ],
    questions: [
      Object.assign(q(141, "linked-list-cycle", "Linked List Cycle", "easy", ["linked-list"]), { order: 1 }),
      Object.assign(q(876, "middle-of-the-linked-list", "Middle of the Linked List", "easy", ["linked-list"]), {
        order: 2,
      }),
      Object.assign(q(19, "remove-nth-node-from-end-of-list", "Remove Nth Node From End of List", "medium", ["linked-list"]), {
        order: 3,
      }),
      Object.assign(q(142, "linked-list-cycle-ii", "Linked List Cycle II", "medium", ["linked-list"]), { order: 4 }),
      Object.assign(q(202, "happy-number", "Happy Number", "easy", ["math"]), { order: 5 }),
      Object.assign(q(234, "palindrome-linked-list", "Palindrome Linked List", "easy", ["linked-list"]), { order: 6 }),
      Object.assign(q(143, "reorder-list", "Reorder List", "medium", ["linked-list"]), { order: 7 }),
    ],
  },
  {
    slug: "merge-intervals",
    title: "Merge Intervals",
    description: "Overlapping ranges, scheduling, and sweep-line style problems.",
    whenToUse: ["Overlapping ranges", "Scheduling", "Calendar problems"],
    order: 4,
    useCases: [
      {
        title: "Calendar scheduling",
        description: "Meeting room allocation merges overlapping time intervals to find free slots.",
        techExample: "Google Calendar, Outlook, and Calendly use interval merging for conflict detection.",
        companyOrProduct: "Google Calendar",
      },
    ],
    questions: [
      Object.assign(q(56, "merge-intervals", "Merge Intervals", "medium", ["array"]), { order: 1 }),
      Object.assign(q(57, "insert-interval", "Insert Interval", "medium", ["array"]), { order: 2 }),
      Object.assign(q(435, "non-overlapping-intervals", "Non-overlapping Intervals", "medium", ["array"]), { order: 3 }),
      Object.assign(q(252, "meeting-rooms", "Meeting Rooms", "easy", ["array"]), { order: 4 }),
      Object.assign(q(253, "meeting-rooms-ii", "Meeting Rooms II", "medium", ["array"]), { order: 5 }),
      Object.assign(
        q(452, "minimum-number-of-arrows-to-burst-balloons", "Minimum Number of Arrows to Burst Balloons", "medium", [
          "array",
        ]),
        { order: 6 }
      ),
      Object.assign(q(759, "employee-free-time", "Employee Free Time", "hard", ["array"]), { order: 7 }),
    ],
  },
  {
    slug: "cyclic-sort",
    title: "Cyclic Sort",
    description: "Array contains numbers in range [1..n]; find missing, duplicate, or misplaced elements.",
    whenToUse: ["Numbers in range 1..n", "Find missing/duplicate", "In-place rearrangement"],
    order: 5,
    useCases: [
      {
        title: "Slot allocation",
        description: "Assign items to fixed slots when IDs are in a known range without extra memory.",
        techExample: "Memory pool allocators and disk block remapping in storage engines.",
      },
    ],
    questions: [
      Object.assign(q(268, "missing-number", "Missing Number", "easy", ["array"]), { order: 1 }),
      Object.assign(
        q(448, "find-all-numbers-disappeared-in-an-array", "Find All Numbers Disappeared in an Array", "easy", ["array"]),
        { order: 2 }
      ),
      Object.assign(q(287, "find-the-duplicate-number", "Find the Duplicate Number", "medium", ["array"]), { order: 3 }),
      Object.assign(q(442, "find-all-duplicates-in-an-array", "Find All Duplicates in an Array", "medium", ["array"]), {
        order: 4,
      }),
      Object.assign(q(41, "first-missing-positive", "First Missing Positive", "hard", ["array"]), { order: 5 }),
      Object.assign(q(645, "set-mismatch", "Set Mismatch", "easy", ["array"]), { order: 6 }),
    ],
  },
  {
    slug: "linked-list-reversal",
    title: "In-place Linked List Reversal",
    description: "Reverse full list, a segment, or k-group in O(1) extra space.",
    whenToUse: ["Reverse linked list", "Reverse k-group", "In-place manipulation"],
    order: 6,
    useCases: [
      {
        title: "Undo/redo buffers",
        description: "Reversing linked structures models stack-like undo chains in editors.",
        techExample: "Text editor undo stacks and browser history back-navigation.",
      },
    ],
    questions: [
      Object.assign(q(206, "reverse-linked-list", "Reverse Linked List", "easy", ["linked-list"]), { order: 1 }),
      Object.assign(q(92, "reverse-linked-list-ii", "Reverse Linked List II", "medium", ["linked-list"]), { order: 2 }),
      Object.assign(q(25, "reverse-nodes-in-k-group", "Reverse Nodes in k-Group", "hard", ["linked-list"]), { order: 3 }),
      Object.assign(q(24, "swap-nodes-in-pairs", "Swap Nodes in Pairs", "medium", ["linked-list"]), { order: 4 }),
      Object.assign(q(61, "rotate-list", "Rotate List", "medium", ["linked-list"]), { order: 5 }),
    ],
  },
  {
    slug: "tree-bfs",
    title: "Tree BFS",
    description: "Level-by-level traversal using a queue; shortest path in unweighted trees.",
    whenToUse: ["Level order traversal", "Shortest path in tree", "Zigzag / level views"],
    order: 7,
    useCases: [
      {
        title: "Org chart traversal",
        description: "BFS walks an org tree level by level for hierarchy displays.",
        techExample: "LinkedIn org charts, LDAP directory browsers, and file-system tree UIs.",
        companyOrProduct: "LinkedIn",
      },
    ],
    questions: [
      Object.assign(q(102, "binary-tree-level-order-traversal", "Binary Tree Level Order Traversal", "medium", ["tree"]), {
        order: 1,
      }),
      Object.assign(
        q(103, "binary-tree-zigzag-level-order-traversal", "Binary Tree Zigzag Level Order Traversal", "medium", ["tree"]),
        { order: 2 }
      ),
      Object.assign(q(637, "average-of-levels-in-binary-tree", "Average of Levels in Binary Tree", "easy", ["tree"]), {
        order: 3,
      }),
      Object.assign(q(111, "minimum-depth-of-binary-tree", "Minimum Depth of Binary Tree", "easy", ["tree"]), { order: 4 }),
      Object.assign(q(199, "binary-tree-right-side-view", "Binary Tree Right Side View", "medium", ["tree"]), { order: 5 }),
      Object.assign(
        q(116, "populating-next-right-pointers-in-each-node", "Populating Next Right Pointers in Each Node", "medium", [
          "tree",
        ]),
        { order: 6 }
      ),
      Object.assign(
        q(107, "binary-tree-level-order-traversal-ii", "Binary Tree Level Order Traversal II", "medium", ["tree"]),
        { order: 7 }
      ),
    ],
  },
  {
    slug: "tree-dfs",
    title: "Tree DFS",
    description: "Recursive or stack-based depth-first traversal for path and subtree problems.",
    whenToUse: ["Path problems", "Subtree properties", "Tree recursion"],
    order: 8,
    useCases: [
      {
        title: "File system traversal",
        description: "DFS walks directory trees to compute sizes, find files, or build indexes.",
        techExample: "Unix find, ripgrep directory walks, and S3 prefix listing.",
      },
    ],
    questions: [
      Object.assign(q(104, "maximum-depth-of-binary-tree", "Maximum Depth of Binary Tree", "easy", ["tree"]), { order: 1 }),
      Object.assign(q(100, "same-tree", "Same Tree", "easy", ["tree"]), { order: 2 }),
      Object.assign(q(226, "invert-binary-tree", "Invert Binary Tree", "easy", ["tree"]), { order: 3 }),
      Object.assign(q(112, "path-sum", "Path Sum", "easy", ["tree"]), { order: 4 }),
      Object.assign(q(543, "diameter-of-binary-tree", "Diameter of Binary Tree", "easy", ["tree"]), { order: 5 }),
      Object.assign(
        q(235, "lowest-common-ancestor-of-a-binary-search-tree", "Lowest Common Ancestor of a BST", "medium", ["tree"]),
        { order: 6 }
      ),
      Object.assign(q(124, "binary-tree-maximum-path-sum", "Binary Tree Maximum Path Sum", "hard", ["tree"]), { order: 7 }),
      Object.assign(
        q(297, "serialize-and-deserialize-binary-tree", "Serialize and Deserialize Binary Tree", "hard", ["tree"]),
        { order: 8 }
      ),
    ],
  },
  {
    slug: "two-heaps",
    title: "Two Heaps",
    description: "Balance two priority queues to track running median or similar streaming stats.",
    whenToUse: ["Running median", "Balance two halves", "Streaming statistics"],
    order: 9,
    useCases: [
      {
        title: "Real-time percentile metrics",
        description: "Two heaps maintain median/percentile over streaming latency samples.",
        techExample: "Datadog, Prometheus histograms, and APM latency dashboards.",
        companyOrProduct: "Datadog",
      },
    ],
    questions: [
      Object.assign(q(295, "find-median-from-data-stream", "Find Median from Data Stream", "hard", ["heap"]), { order: 1 }),
      Object.assign(q(480, "sliding-window-median", "Sliding Window Median", "hard", ["heap"]), { order: 2 }),
      Object.assign(q(502, "ipo", "IPO", "hard", ["heap", "greedy"]), { order: 3 }),
    ],
  },
  {
    slug: "subsets-combinations",
    title: "Subsets / Combinations",
    description: "Generate all subsets, combinations, and permutations with backtracking.",
    whenToUse: ["Generate subsets", "Combinations", "Permutations"],
    order: 10,
    useCases: [
      {
        title: "Feature flag combinations",
        description: "Enumerate all subset combinations of feature toggles for A/B test configs.",
        techExample: "LaunchDarkly flag targeting and experiment matrix generation.",
      },
    ],
    questions: [
      Object.assign(q(78, "subsets", "Subsets", "medium", ["backtracking"]), { order: 1 }),
      Object.assign(q(90, "subsets-ii", "Subsets II", "medium", ["backtracking"]), { order: 2 }),
      Object.assign(q(77, "combinations", "Combinations", "medium", ["backtracking"]), { order: 3 }),
      Object.assign(q(39, "combination-sum", "Combination Sum", "medium", ["backtracking"]), { order: 4 }),
      Object.assign(q(40, "combination-sum-ii", "Combination Sum II", "medium", ["backtracking"]), { order: 5 }),
      Object.assign(q(46, "permutations", "Permutations", "medium", ["backtracking"]), { order: 6 }),
      Object.assign(
        q(17, "letter-combinations-of-a-phone-number", "Letter Combinations of a Phone Number", "medium", [
          "backtracking",
        ]),
        { order: 7 }
      ),
    ],
  },
  {
    slug: "binary-search",
    title: "Modified Binary Search",
    description: "Binary search on sorted/rotated arrays, first/last occurrence, or answer space.",
    whenToUse: ["Sorted arrays", "Rotated arrays", "Search on answer"],
    order: 11,
    useCases: [
      {
        title: "Database index lookups",
        description: "B-tree indexes use binary search to locate rows in O(log n).",
        techExample: "PostgreSQL and MySQL index scans on sorted B-tree pages.",
        companyOrProduct: "PostgreSQL",
      },
    ],
    questions: [
      Object.assign(q(704, "binary-search", "Binary Search", "easy", ["binary-search"]), { order: 1 }),
      Object.assign(q(278, "first-bad-version", "First Bad Version", "easy", ["binary-search"]), { order: 2 }),
      Object.assign(q(35, "search-insert-position", "Search Insert Position", "easy", ["binary-search"]), { order: 3 }),
      Object.assign(
        q(34, "find-first-and-last-position-of-element-in-sorted-array", "Find First and Last Position of Element in Sorted Array", "medium", ["binary-search"]),
        { order: 4 }
      ),
      Object.assign(q(33, "search-in-rotated-sorted-array", "Search in Rotated Sorted Array", "medium", ["binary-search"]), {
        order: 5,
      }),
      Object.assign(
        q(153, "find-minimum-in-rotated-sorted-array", "Find Minimum in Rotated Sorted Array", "medium", ["binary-search"]),
        { order: 6 }
      ),
      Object.assign(q(875, "koko-eating-bananas", "Koko Eating Bananas", "medium", ["binary-search"]), { order: 7 }),
      Object.assign(q(4, "median-of-two-sorted-arrays", "Median of Two Sorted Arrays", "hard", ["binary-search"]), {
        order: 8,
      }),
    ],
  },
  {
    slug: "top-k-elements",
    title: "Top K Elements",
    description: "Find K largest, smallest, or most frequent elements using heap or bucket sort.",
    whenToUse: ["K largest/smallest", "K most frequent", "Priority queue"],
    order: 12,
    useCases: [
      {
        title: "Top-N query optimization",
        description: "Databases use heap-based top-K for ORDER BY ... LIMIT K without full sort.",
        techExample: "Elasticsearch top hits aggregations and SQL LIMIT with priority queues.",
      },
    ],
    questions: [
      Object.assign(q(215, "kth-largest-element-in-an-array", "Kth Largest Element in an Array", "medium", ["heap"]), {
        order: 1,
      }),
      Object.assign(q(347, "top-k-frequent-elements", "Top K Frequent Elements", "medium", ["heap"]), { order: 2 }),
      Object.assign(q(973, "k-closest-points-to-origin", "K Closest Points to Origin", "medium", ["heap"]), { order: 3 }),
      Object.assign(q(451, "sort-characters-by-frequency", "Sort Characters By Frequency", "medium", ["heap"]), {
        order: 4,
      }),
      Object.assign(q(767, "reorganize-string", "Reorganize String", "medium", ["heap"]), { order: 5 }),
      Object.assign(q(373, "find-k-pairs-with-smallest-sums", "Find K Pairs with Smallest Sums", "medium", ["heap"]), {
        order: 6,
      }),
    ],
  },
  {
    slug: "k-way-merge",
    title: "K-way Merge",
    description: "Merge K sorted lists or arrays efficiently using a min-heap.",
    whenToUse: ["Merge K sorted lists", "Smallest range", "Kth element in matrix"],
    order: 13,
    useCases: [
      {
        title: "Merge sorted shard results",
        description: "Distributed databases merge sorted results from multiple shards.",
        techExample: "Elasticsearch multi-shard search result merging and MapReduce combiners.",
      },
    ],
    questions: [
      Object.assign(q(21, "merge-two-sorted-lists", "Merge Two Sorted Lists", "easy", ["linked-list"]), { order: 1 }),
      Object.assign(q(23, "merge-k-sorted-lists", "Merge k Sorted Lists", "hard", ["heap"]), { order: 2 }),
      Object.assign(
        q(378, "kth-smallest-element-in-a-sorted-matrix", "Kth Smallest Element in a Sorted Matrix", "medium", ["heap"]),
        { order: 3 }
      ),
      Object.assign(
        q(632, "smallest-range-covering-elements-from-k-lists", "Smallest Range Covering Elements from K Lists", "hard", [
          "heap",
        ]),
        { order: 4 }
      ),
    ],
  },
  {
    slug: "monotonic-stack",
    title: "Monotonic Stack",
    description: "Stack maintaining monotonic order for next greater/smaller and histogram problems.",
    whenToUse: ["Next greater element", "Histogram area", "Span problems"],
    order: 14,
    useCases: [
      {
        title: "Stock span / price alerts",
        description: "Monotonic stacks compute how long prices stay below a threshold.",
        techExample: "Real-time trading dashboards computing support/resistance levels.",
      },
    ],
    questions: [
      Object.assign(q(496, "next-greater-element-i", "Next Greater Element I", "easy", ["stack"]), { order: 1 }),
      Object.assign(q(739, "daily-temperatures", "Daily Temperatures", "medium", ["stack"]), { order: 2 }),
      Object.assign(q(84, "largest-rectangle-in-histogram", "Largest Rectangle in Histogram", "hard", ["stack"]), {
        order: 3,
      }),
      Object.assign(q(907, "sum-of-subarray-minimums", "Sum of Subarray Minimums", "medium", ["stack"]), { order: 4 }),
      Object.assign(q(402, "remove-k-digits", "Remove K Digits", "medium", ["stack"]), { order: 5 }),
      Object.assign(q(85, "maximal-rectangle", "Maximal Rectangle", "hard", ["stack"]), { order: 6 }),
    ],
  },
  {
    slug: "monotonic-queue",
    title: "Monotonic Queue / Deque",
    description: "Deque maintaining monotonic order for sliding window max/min in O(n).",
    whenToUse: ["Sliding window max/min", "Deque optimization"],
    order: 15,
    useCases: [
      {
        title: "Rolling max latency",
        description: "Track maximum API latency over a sliding time window in O(1) amortized.",
        techExample: "CDN edge monitoring and real-time anomaly detection pipelines.",
      },
    ],
    questions: [
      Object.assign(q(239, "sliding-window-maximum", "Sliding Window Maximum", "hard", ["deque"]), { order: 1 }),
      Object.assign(q(862, "shortest-subarray-with-sum-at-least-k", "Shortest Subarray with Sum at Least K", "hard", [
        "deque",
      ]), { order: 2 }),
      Object.assign(q(1425, "constrained-subsequence-sum", "Constrained Subsequence Sum", "hard", ["deque"]), { order: 3 }),
    ],
  },
  {
    slug: "prefix-sum-hashmap",
    title: "Prefix Sum + Hash Map",
    description: "Prefix sums with hash map for subarray sum and count problems.",
    whenToUse: ["Subarray sum equals K", "Continuous subarray", "Range queries"],
    order: 16,
    useCases: [
      {
        title: "Billing period aggregation",
        description: "Prefix sums compute cumulative usage over time windows for metered billing.",
        techExample: "AWS CloudWatch metric rollups and Stripe usage-based billing.",
        companyOrProduct: "Stripe",
      },
    ],
    questions: [
      Object.assign(q(303, "range-sum-query-immutable", "Range Sum Query - Immutable", "easy", ["prefix-sum"]), {
        order: 1,
      }),
      Object.assign(q(560, "subarray-sum-equals-k", "Subarray Sum Equals K", "medium", ["prefix-sum"]), { order: 2 }),
      Object.assign(q(523, "continuous-subarray-sum", "Continuous Subarray Sum", "medium", ["prefix-sum"]), { order: 3 }),
      Object.assign(q(930, "binary-subarrays-with-sum", "Binary Subarrays With Sum", "medium", ["prefix-sum"]), {
        order: 4,
      }),
      Object.assign(q(525, "contiguous-array", "Contiguous Array", "medium", ["prefix-sum"]), { order: 5 }),
    ],
  },
  {
    slug: "hash-map-set",
    title: "Hash Map / Set",
    description: "Frequency counting, anagrams, deduplication, and O(1) lookups.",
    whenToUse: ["Frequency count", "Anagrams", "Two-sum variants", "Caching"],
    order: 17,
    useCases: [
      {
        title: "In-memory caching",
        description: "Hash maps power O(1) key-value lookups in caches and session stores.",
        techExample: "Redis hash tables, Memcached, and LRU cache implementations.",
        companyOrProduct: "Redis",
      },
    ],
    questions: [
      Object.assign(q(1, "two-sum", "Two Sum", "easy", ["hash-map"]), { order: 1 }),
      Object.assign(q(49, "group-anagrams", "Group Anagrams", "medium", ["hash-map"]), { order: 2 }),
      Object.assign(q(242, "valid-anagram", "Valid Anagram", "easy", ["hash-map"]), { order: 3 }),
      Object.assign(q(128, "longest-consecutive-sequence", "Longest Consecutive Sequence", "medium", ["hash-map"]), {
        order: 4,
      }),
      Object.assign(q(138, "copy-list-with-random-pointer", "Copy List with Random Pointer", "medium", ["hash-map"]), {
        order: 5,
      }),
      Object.assign(q(146, "lru-cache", "LRU Cache", "medium", ["design"]), { order: 6 }),
      Object.assign(q(380, "insert-delete-getrandom-o1", "Insert Delete GetRandom O(1)", "medium", ["design"]), {
        order: 7,
      }),
    ],
  },
  {
    slug: "backtracking",
    title: "Backtracking",
    description: "Explore all valid configurations with pruning and undo steps.",
    whenToUse: ["Generate combinations", "Constraint satisfaction", "Search with pruning"],
    order: 18,
    useCases: [
      {
        title: "Constraint solvers",
        description: "Backtracking explores solution spaces with pruning — used in schedulers and puzzle solvers.",
        techExample: "Kubernetes pod scheduling constraints and SAT solvers.",
      },
    ],
    questions: [
      Object.assign(q(22, "generate-parentheses", "Generate Parentheses", "medium", ["backtracking"]), { order: 1 }),
      Object.assign(q(51, "n-queens", "N-Queens", "hard", ["backtracking"]), { order: 2 }),
      Object.assign(q(79, "word-search", "Word Search", "medium", ["backtracking"]), { order: 3 }),
      Object.assign(q(131, "palindrome-partitioning", "Palindrome Partitioning", "medium", ["backtracking"]), { order: 4 }),
      Object.assign(q(37, "sudoku-solver", "Sudoku Solver", "hard", ["backtracking"]), { order: 5 }),
      Object.assign(q(93, "restore-ip-addresses", "Restore IP Addresses", "medium", ["backtracking"]), { order: 6 }),
      Object.assign(q(212, "word-search-ii", "Word Search II", "hard", ["backtracking", "trie"]), { order: 7 }),
    ],
  },
  {
    slug: "graph-bfs-dfs",
    title: "Graph BFS / DFS",
    description: "Connected components, islands, clone graph, and shortest path in grids.",
    whenToUse: ["Connected components", "Grid traversal", "Shortest path"],
    order: 19,
    useCases: [
      {
        title: "Social graph traversal",
        description: "BFS finds shortest connection paths; DFS explores friend networks.",
        techExample: "LinkedIn 'people you may know' and Facebook friend suggestions.",
        companyOrProduct: "LinkedIn",
      },
    ],
    questions: [
      Object.assign(q(200, "number-of-islands", "Number of Islands", "medium", ["graph"]), { order: 1 }),
      Object.assign(q(133, "clone-graph", "Clone Graph", "medium", ["graph"]), { order: 2 }),
      Object.assign(q(417, "pacific-atlantic-water-flow", "Pacific Atlantic Water Flow", "medium", ["graph"]), {
        order: 3,
      }),
      Object.assign(q(994, "rotting-oranges", "Rotting Oranges", "medium", ["graph"]), { order: 4 }),
      Object.assign(q(127, "word-ladder", "Word Ladder", "hard", ["graph"]), { order: 5 }),
      Object.assign(q(207, "course-schedule", "Course Schedule", "medium", ["graph"]), { order: 6 }),
      Object.assign(q(130, "surrounded-regions", "Surrounded Regions", "medium", ["graph"]), { order: 7 }),
      Object.assign(q(743, "network-delay-time", "Network Delay Time", "medium", ["graph"]), { order: 8 }),
    ],
  },
  {
    slug: "topological-sort",
    title: "Topological Sort",
    description: "Dependency ordering for DAGs — courses, build order, alien dictionary.",
    whenToUse: ["Dependency ordering", "Course prerequisites", "Build pipelines"],
    order: 20,
    useCases: [
      {
        title: "Build system task ordering",
        description: "Topological sort determines compilation order respecting dependencies.",
        techExample: "Bazel, Gradle, and npm dependency resolution graphs.",
        companyOrProduct: "Bazel",
      },
    ],
    questions: [
      Object.assign(q(210, "course-schedule-ii", "Course Schedule II", "medium", ["graph"]), { order: 1 }),
      Object.assign(q(269, "alien-dictionary", "Alien Dictionary", "hard", ["graph"]), { order: 2 }),
      Object.assign(q(310, "minimum-height-trees", "Minimum Height Trees", "medium", ["graph"]), { order: 3 }),
      Object.assign(q(444, "sequence-reconstruction", "Sequence Reconstruction", "medium", ["graph"]), { order: 4 }),
    ],
  },
  {
    slug: "union-find",
    title: "Union Find (Disjoint Set)",
    description: "Dynamic connectivity, cycle detection, and grouping with path compression.",
    whenToUse: ["Dynamic connectivity", "Cycle detection", "Grouping"],
    order: 21,
    useCases: [
      {
        title: "Network connectivity",
        description: "Union-find tracks connected components as edges are added dynamically.",
        techExample: "Kubernetes network policy grouping and Kruskal's MST algorithm.",
      },
    ],
    questions: [
      Object.assign(q(323, "number-of-connected-components-in-an-undirected-graph", "Number of Connected Components in an Undirected Graph", "medium", ["union-find"]), { order: 1 }),
      Object.assign(q(684, "redundant-connection", "Redundant Connection", "medium", ["union-find"]), { order: 2 }),
      Object.assign(q(721, "accounts-merge", "Accounts Merge", "medium", ["union-find"]), { order: 3 }),
      Object.assign(q(261, "graph-valid-tree", "Graph Valid Tree", "medium", ["union-find"]), { order: 4 }),
      Object.assign(q(947, "most-stones-removed-with-same-row-or-column", "Most Stones Removed with Same Row or Column", "medium", ["union-find"]), { order: 5 }),
      Object.assign(q(1202, "smallest-string-with-swaps", "Smallest String With Swaps", "medium", ["union-find"]), {
        order: 6,
      }),
    ],
  },
  {
    slug: "trie",
    title: "Trie",
    description: "Prefix tree for autocomplete, word search, and XOR problems.",
    whenToUse: ["Prefix search", "Autocomplete", "Word dictionary"],
    order: 22,
    useCases: [
      {
        title: "Autocomplete / typeahead",
        description: "Tries power search-as-you-type in browsers, IDEs, and search bars.",
        techExample: "Google Search autocomplete, VS Code IntelliSense, and Elasticsearch suggesters.",
        companyOrProduct: "Google",
      },
    ],
    questions: [
      Object.assign(q(208, "implement-trie-prefix-tree", "Implement Trie (Prefix Tree)", "medium", ["trie"]), { order: 1 }),
      Object.assign(q(211, "design-add-and-search-words-data-structure", "Design Add and Search Words Data Structure", "medium", ["trie"]), { order: 2 }),
      Object.assign(q(648, "replace-words", "Replace Words", "medium", ["trie"]), { order: 3 }),
      Object.assign(q(421, "maximum-xor-of-two-numbers-in-an-array", "Maximum XOR of Two Numbers in an Array", "medium", ["trie"]), { order: 4 }),
    ],
  },
  {
    slug: "greedy",
    title: "Greedy",
    description: "Local optimal choices that lead to global optimum when structure allows.",
    whenToUse: ["Interval scheduling", "Jump games", "Huffman-like choices"],
    order: 23,
    useCases: [
      {
        title: "Task scheduling",
        description: "Greedy picks highest-priority tasks first when optimal scheduling applies.",
        techExample: "OS process schedulers, cron job ordering, and CDN cache eviction (LRU).",
      },
    ],
    questions: [
      Object.assign(q(455, "assign-cookies", "Assign Cookies", "easy", ["greedy"]), { order: 1 }),
      Object.assign(q(55, "jump-game", "Jump Game", "medium", ["greedy"]), { order: 2 }),
      Object.assign(q(45, "jump-game-ii", "Jump Game II", "medium", ["greedy"]), { order: 3 }),
      Object.assign(q(134, "gas-station", "Gas Station", "medium", ["greedy"]), { order: 4 }),
      Object.assign(q(763, "partition-labels", "Partition Labels", "medium", ["greedy"]), { order: 5 }),
      Object.assign(q(621, "task-scheduler", "Task Scheduler", "medium", ["greedy"]), { order: 6 }),
      Object.assign(q(135, "candy", "Candy", "hard", ["greedy"]), { order: 7 }),
      Object.assign(q(871, "minimum-number-of-refueling-stops", "Minimum Number of Refueling Stops", "hard", ["greedy"]), {
        order: 8,
      }),
    ],
  },
  {
    slug: "bit-manipulation",
    title: "Bit Manipulation / XOR",
    description: "Bitwise ops, XOR tricks, and subset enumeration via bitmask.",
    whenToUse: ["Single number", "Power of two", "Subset enumeration"],
    order: 24,
    useCases: [
      {
        title: "Feature flags & permissions",
        description: "Bitmasks encode compact permission sets and feature toggles.",
        techExample: "Unix file permissions (chmod), Linux capabilities, and RBAC bitfields.",
      },
    ],
    questions: [
      Object.assign(q(136, "single-number", "Single Number", "easy", ["bit-manipulation"]), { order: 1 }),
      Object.assign(q(191, "number-of-1-bits", "Number of 1 Bits", "easy", ["bit-manipulation"]), { order: 2 }),
      Object.assign(q(338, "counting-bits", "Counting Bits", "easy", ["bit-manipulation"]), { order: 3 }),
      Object.assign(q(190, "reverse-bits", "Reverse Bits", "easy", ["bit-manipulation"]), { order: 4 }),
    ],
  },
  {
    slug: "dp-1d",
    title: "1D Dynamic Programming",
    description: "Optimal substructure along a single sequence or linear state.",
    whenToUse: ["Linear sequences", "House robber style", "Coin change"],
    order: 25,
    useCases: [
      {
        title: "Resource allocation",
        description: "DP optimizes sequential decisions with overlapping subproblems.",
        techExample: "Ad budget allocation, inventory replenishment, and pricing engines.",
      },
    ],
    questions: [
      Object.assign(q(70, "climbing-stairs", "Climbing Stairs", "easy", ["dp"]), { order: 1 }),
      Object.assign(q(198, "house-robber", "House Robber", "medium", ["dp"]), { order: 2 }),
      Object.assign(q(213, "house-robber-ii", "House Robber II", "medium", ["dp"]), { order: 3 }),
      Object.assign(q(91, "decode-ways", "Decode Ways", "medium", ["dp"]), { order: 4 }),
      Object.assign(q(322, "coin-change", "Coin Change", "medium", ["dp"]), { order: 5 }),
      Object.assign(q(300, "longest-increasing-subsequence", "Longest Increasing Subsequence", "medium", ["dp"]), {
        order: 6,
      }),
      Object.assign(q(139, "word-break", "Word Break", "medium", ["dp"]), { order: 7 }),
      Object.assign(q(152, "maximum-product-subarray", "Maximum Product Subarray", "medium", ["dp"]), { order: 8 }),
    ],
  },
  {
    slug: "dp-2d-grid",
    title: "2D / Grid DP",
    description: "Paths, min cost, and grid-based optimization with 2D state.",
    whenToUse: ["Grid paths", "Edit distance", "2D optimization"],
    order: 26,
    useCases: [
      {
        title: "Sequence alignment",
        description: "Edit distance DP aligns strings for diff tools and bioinformatics.",
        techExample: "Git diff (Myers), DNA sequence alignment, and spell checkers.",
        companyOrProduct: "Git",
      },
    ],
    questions: [
      Object.assign(q(62, "unique-paths", "Unique Paths", "medium", ["dp"]), { order: 1 }),
      Object.assign(q(63, "unique-paths-ii", "Unique Paths II", "medium", ["dp"]), { order: 2 }),
      Object.assign(q(64, "minimum-path-sum", "Minimum Path Sum", "medium", ["dp"]), { order: 3 }),
      Object.assign(q(221, "maximal-square", "Maximal Square", "medium", ["dp"]), { order: 4 }),
      Object.assign(q(72, "edit-distance", "Edit Distance", "medium", ["dp"]), { order: 5 }),
      Object.assign(q(1143, "longest-common-subsequence", "Longest Common Subsequence", "medium", ["dp"]), { order: 6 }),
      Object.assign(q(97, "interleaving-string", "Interleaving String", "medium", ["dp"]), { order: 7 }),
      Object.assign(q(174, "dungeon-game", "Dungeon Game", "hard", ["dp"]), { order: 8 }),
    ],
  },
  {
    slug: "dp-knapsack",
    title: "Knapsack DP",
    description: "Pick items with weight/value constraints; subset sum variants.",
    whenToUse: ["Subset sum", "0/1 knapsack", "Unbounded knapsack"],
    order: 27,
    useCases: [
      {
        title: "Budget optimization",
        description: "Knapsack models selecting projects/features under budget constraints.",
        techExample: "Portfolio optimization and cloud resource packing problems.",
      },
    ],
    questions: [
      Object.assign(q(416, "partition-equal-subset-sum", "Partition Equal Subset Sum", "medium", ["dp"]), { order: 1 }),
      Object.assign(q(494, "target-sum", "Target Sum", "medium", ["dp"]), { order: 2 }),
      Object.assign(q(518, "coin-change-ii", "Coin Change II", "medium", ["dp"]), { order: 3 }),
      Object.assign(q(474, "ones-and-zeroes", "Ones and Zeroes", "medium", ["dp"]), { order: 4 }),
      Object.assign(q(1049, "last-stone-weight-ii", "Last Stone Weight II", "medium", ["dp"]), { order: 5 }),
      Object.assign(q(879, "profitable-schemes", "Profitable Schemes", "hard", ["dp"]), { order: 6 }),
    ],
  },
  {
    slug: "dp-state-machine",
    title: "Interval / State Machine DP",
    description: "State transitions over time — buy/sell stock, job scheduling.",
    whenToUse: ["Buy/sell stock", "State transitions", "Interval scheduling"],
    order: 28,
    useCases: [
      {
        title: "Trading strategies",
        description: "State machine DP models buy/hold/sell decisions over time series.",
        techExample: "Algorithmic trading backtesting and dynamic pricing engines.",
      },
    ],
    questions: [
      Object.assign(q(121, "best-time-to-buy-and-sell-stock", "Best Time to Buy and Sell Stock", "easy", ["dp"]), {
        order: 1,
      }),
      Object.assign(
        q(309, "best-time-to-buy-and-sell-stock-with-cooldown", "Best Time to Buy and Sell Stock with Cooldown", "medium", [
          "dp",
        ]),
        { order: 2 }
      ),
      Object.assign(q(123, "best-time-to-buy-and-sell-stock-iii", "Best Time to Buy and Sell Stock III", "hard", ["dp"]), {
        order: 3,
      }),
      Object.assign(
        q(1235, "maximum-profit-in-job-scheduling", "Maximum Profit in Job Scheduling", "hard", ["dp"]),
        { order: 4 }
      ),
      Object.assign(q(740, "delete-and-earn", "Delete and Earn", "medium", ["dp"]), { order: 5 }),
    ],
  },
  {
    slug: "tree-dp",
    title: "Tree DP",
    description: "Optimal decisions on tree nodes — include/exclude child subtrees.",
    whenToUse: ["Include/exclude subtrees", "Tree path optimization"],
    order: 29,
    useCases: [
      {
        title: "Network node placement",
        description: "Place monitors/cameras on trees minimizing cost while covering all nodes.",
        techExample: "CDN edge server placement and network monitoring point selection.",
      },
    ],
    questions: [
      Object.assign(q(337, "house-robber-iii", "House Robber III", "medium", ["tree-dp"]), { order: 1 }),
      Object.assign(q(687, "longest-univalue-path", "Longest Univalue Path", "medium", ["tree-dp"]), { order: 2 }),
      Object.assign(q(968, "binary-tree-cameras", "Binary Tree Cameras", "hard", ["tree-dp"]), { order: 3 }),
    ],
  },
  {
    slug: "divide-and-conquer",
    title: "Divide & Conquer",
    description: "Split problem in half, merge results — often O(n log n).",
    whenToUse: ["Merge sort style", "Count inversions", "Quickselect"],
    order: 30,
    useCases: [
      {
        title: "Parallel map-reduce",
        description: "Divide data, process in parallel, merge results — core MapReduce pattern.",
        techExample: "Hadoop/Spark distributed sorting and aggregation.",
        companyOrProduct: "Apache Spark",
      },
    ],
    questions: [
      Object.assign(q(493, "reverse-pairs", "Reverse Pairs", "hard", ["divide-and-conquer"]), { order: 1 }),
      Object.assign(q(50, "powx-n", "Pow(x, n)", "medium", ["divide-and-conquer"]), { order: 2 }),
      Object.assign(q(427, "construct-quad-tree", "Construct Quad Tree", "medium", ["divide-and-conquer"]), { order: 3 }),
      Object.assign(
        q(241, "different-ways-to-add-parentheses", "Different Ways to Add Parentheses", "medium", [
          "divide-and-conquer",
        ]),
        { order: 4 }
      ),
    ],
  },
  {
    slug: "stack-general",
    title: "Stack (General)",
    description: "Parsing, expression evaluation, and nested structure validation.",
    whenToUse: ["Valid parentheses", "Expression eval", "Nested structures"],
    order: 31,
    useCases: [
      {
        title: "Expression parsing",
        description: "Stacks evaluate arithmetic expressions and parse nested JSON/HTML.",
        techExample: "JavaScript V8 parser, JSON.parse, and template engine compilers.",
      },
    ],
    questions: [
      Object.assign(q(20, "valid-parentheses", "Valid Parentheses", "easy", ["stack"]), { order: 1 }),
      Object.assign(q(155, "min-stack", "Min Stack", "medium", ["stack", "design"]), { order: 2 }),
      Object.assign(
        q(150, "evaluate-reverse-polish-notation", "Evaluate Reverse Polish Notation", "medium", ["stack"]),
        { order: 3 }
      ),
      Object.assign(q(227, "basic-calculator-ii", "Basic Calculator II", "medium", ["stack"]), { order: 4 }),
      Object.assign(q(394, "decode-string", "Decode String", "medium", ["stack"]), { order: 5 }),
      Object.assign(q(735, "asteroid-collision", "Asteroid Collision", "medium", ["stack"]), { order: 6 }),
      Object.assign(q(224, "basic-calculator", "Basic Calculator", "hard", ["stack"]), { order: 7 }),
    ],
  },
  {
    slug: "bfs-grid",
    title: "Queue / BFS on Grid",
    description: "Multi-source BFS and shortest path on 0-1 or unweighted grids.",
    whenToUse: ["Shortest path in grid", "Multi-source BFS", "0-1 BFS"],
    order: 32,
    useCases: [
      {
        title: "Maze / pathfinding",
        description: "BFS finds shortest paths in game maps, robots, and navigation.",
        techExample: "Google Maps routing, game AI pathfinding, and warehouse robots.",
        companyOrProduct: "Google Maps",
      },
    ],
    questions: [
      Object.assign(q(1091, "shortest-path-in-binary-matrix", "Shortest Path in Binary Matrix", "medium", ["bfs"]), {
        order: 1,
      }),
      Object.assign(q(286, "walls-and-gates", "Walls and Gates", "medium", ["bfs"]), { order: 2 }),
      Object.assign(q(542, "01-matrix", "01 Matrix", "medium", ["bfs"]), { order: 3 }),
      Object.assign(q(1306, "jump-game-iii", "Jump Game III", "medium", ["bfs"]), { order: 4 }),
    ],
  },
  {
    slug: "string-patterns",
    title: "String Patterns",
    description: "Two pointers on strings, rolling hash, and pattern matching.",
    whenToUse: ["Palindrome", "KMP / strstr", "Rolling hash"],
    order: 33,
    useCases: [
      {
        title: "Plagiarism / duplicate detection",
        description: "Rolling hash finds duplicate substrings in documents efficiently.",
        techExample: "GitHub Copilot dedup, search engine duplicate content detection.",
        companyOrProduct: "Google",
      },
    ],
    questions: [
      Object.assign(q(680, "valid-palindrome-ii", "Valid Palindrome II", "easy", ["string"]), { order: 1 }),
      Object.assign(q(5, "longest-palindromic-substring", "Longest Palindromic Substring", "medium", ["string"]), {
        order: 2,
      }),
      Object.assign(
        q(
          28,
          "find-the-index-of-the-first-occurrence-in-a-string",
          "Find the Index of the First Occurrence in a String",
          "easy",
          ["string"]
        ),
        { order: 3 }
      ),
      Object.assign(q(187, "repeated-dna-sequences", "Repeated DNA Sequences", "medium", ["string"]), { order: 4 }),
      Object.assign(q(1044, "longest-duplicate-substring", "Longest Duplicate Substring", "hard", ["string"]), {
        order: 5,
      }),
    ],
  },
];

// Assign order to all questions if missing and validate counts
let totalQuestions = 0;
for (const pattern of patterns) {
  pattern.questions.forEach((question, idx) => {
    if (!question.order) question.order = idx + 1;
    totalQuestions++;
  });
}

const outPath = path.join(__dirname, "seed-data.json");
fs.writeFileSync(outPath, JSON.stringify(patterns, null, 2));

console.log(`Generated ${patterns.length} patterns, ${totalQuestions} questions → ${outPath}`);
