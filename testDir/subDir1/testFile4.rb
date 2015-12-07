File.open(ARGV[0]).each_line do |line|
  if line != ''
    puts line.swapcase
  end
end
